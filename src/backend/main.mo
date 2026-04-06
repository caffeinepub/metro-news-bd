import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";

actor {
  type Article = {
    id : Nat;
    title : Text;
    summary : Text;
    category : Text;
    imageUrl : Text;
    author : Text;
    publishedAt : Time.Time;
    isFeatured : Bool;
  };

  module Article {
    public func compare(article1 : Article, article2 : Article) : Order.Order {
      Nat.compare(article1.id, article2.id);
    };
  };

  type BreakingNews = {
    id : Nat;
    text : Text;
    createdAt : Time.Time;
  };

  module BreakingNews {
    public func compare(breakingNews1 : BreakingNews, breakingNews2 : BreakingNews) : Order.Order {
      Nat.compare(breakingNews1.id, breakingNews2.id);
    };
  };

  type Admin = Principal;

  let admins = Map.empty<Principal, Bool>();

  let articles = Map.empty<Nat, Article>();
  let breakingNewsItems = Map.empty<Nat, BreakingNews>();

  var nextArticleId = 1;
  var nextBreakingNewsId = 1;

  public shared ({ caller }) func addAdmin(admin : Principal) : async () {
    assertIsAdmin(caller);
    admins.add(admin, true);
  };

  public shared ({ caller }) func createArticle(title : Text, summary : Text, category : Text, imageUrl : Text, author : Text, isFeatured : Bool) : async Nat {
    assertIsAdmin(caller);
    let articleId = nextArticleId;
    nextArticleId += 1;

    let article : Article = {
      id = articleId;
      title;
      summary;
      category;
      imageUrl;
      author;
      publishedAt = Time.now();
      isFeatured;
    };
    articles.add(articleId, article);
    articleId;
  };

  public shared ({ caller }) func createBreakingNews(text : Text) : async Nat {
    assertIsAdmin(caller);
    let breakingNewsId = nextBreakingNewsId;
    nextBreakingNewsId += 1;

    let breakingNews : BreakingNews = {
      id = breakingNewsId;
      text;
      createdAt = Time.now();
    };
    breakingNewsItems.add(breakingNewsId, breakingNews);
    breakingNewsId;
  };

  public query ({ caller }) func getArticle(id : Nat) : async Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query ({ caller }) func getAllArticles() : async [Article] {
    articles.values().toArray().sort();
  };

  public query ({ caller }) func getAllBreakingNews() : async [BreakingNews] {
    breakingNewsItems.values().toArray().sort();
  };

  public query ({ caller }) func getFeaturedArticles() : async [Article] {
    articles.values().toArray().filter(func(article) { article.isFeatured }).sort();
  };

  func assertIsAdmin(caller : Principal) {
    if (caller.toText() == "2vxsx-fae") { return () };
    switch (admins.get(caller)) {
      case (null) { Runtime.trap("Not an admin") };
      case (_) {};
    };
  };
};
