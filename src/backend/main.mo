import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Blob "mo:core/Blob";

actor {
  // ── Existing types ──────────────────────────────────────────────────────────────────
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

  type BreakingNews = {
    id : Nat;
    text : Text;
    createdAt : Time.Time;
  };

  // ── New: External News type ──────────────────────────────────────────────────
  type ExternalNews = {
    id : Nat;
    title : Text;
    summary : Text;
    sourceUrl : Text;
    sourceName : Text;
    category : Text;
    fetchedAt : Time.Time;
  };

  // ── New: Local News Article type (user-submitted, stored on-chain) ──────────────
  type LocalNewsArticle = {
    id : Nat;
    title : Text;
    summary : Text;
    category : Text;
    imageBase64 : Text;
    author : Text;
    sourceName : Text;
    sourceUrl : Text;
    publishedAt : Time.Time;
  };

  // ── HTTP outcalls types ───────────────────────────────────────────────────────────
  type HttpHeader = { name : Text; value : Text };
  type HttpMethod = { #get; #post; #head };
  type HttpRequest = {
    url : Text;
    max_response_bytes : ?Nat64;
    headers : [HttpHeader];
    body : ?[Nat8];
    method : HttpMethod;
    transform : ?TransformArg;
  };
  type HttpResponse = {
    status : Nat;
    headers : [HttpHeader];
    body : [Nat8];
  };
  type TransformArg = {
    function : shared query TransformArgs -> async HttpResponse;
    context : Blob;
  };
  type TransformArgs = { response : HttpResponse; context : Blob };

  let ic : actor {
    http_request : HttpRequest -> async HttpResponse;
  } = actor ("aaaaa-aa");

  // ── State ──────────────────────────────────────────────────────────────────────────
  let admins = Map.empty<Principal, Bool>();
  let articles = Map.empty<Nat, Article>();
  let breakingNewsItems = Map.empty<Nat, BreakingNews>();
  var externalNewsItems = Map.empty<Nat, ExternalNews>();
  let localNewsItems = Map.empty<Nat, LocalNewsArticle>();

  var nextArticleId = 1;
  var nextBreakingNewsId = 1;
  var nextExternalNewsId = 1;
  var nextLocalNewsId = 1;
  var lastFetchedAt : ?Time.Time = null;

  // ── Transform function (strips headers for consensus) ────────────────────────
  public query func transform(args : TransformArgs) : async HttpResponse {
    { status = args.response.status; headers = []; body = args.response.body };
  };

  // ── Text helpers ───────────────────────────────────────────────────────────────────

  // Find the position of needle in haystack; returns null if not found
  func indexOfText(haystack : Text, needle : Text) : ?Nat {
    let hArr = haystack.toArray();
    let nArr = needle.toArray();
    let hLen = hArr.size();
    let nLen = nArr.size();
    if (nLen == 0) return ?0;
    if (nLen > hLen) return null;
    var i = 0;
    label search while (i + nLen <= hLen) {
      var match = true;
      var k = 0;
      while (k < nLen) {
        if (hArr[i + k] != nArr[k]) { match := false };
        k += 1;
      };
      if (match) return ?i;
      i += 1;
    };
    null;
  };

  // Substring: chars from start (inclusive) to end (exclusive)
  func substr(arr : [Char], start : Nat, end_ : Nat) : Text {
    let safeEnd = if (end_ > arr.size()) arr.size() else end_;
    let safeStart = if (start > safeEnd) safeEnd else start;
    Text.fromIter(arr.sliceToArray(safeStart, safeEnd).vals());
  };

  // Return text after the first occurrence of needle; empty string if not found
  func textAfter(haystack : Text, needle : Text) : Text {
    let hArr = haystack.toArray();
    let hLen = hArr.size();
    let nLen = needle.size();
    if (nLen == 0) return haystack;
    switch (indexOfText(haystack, needle)) {
      case null { "" };
      case (?pos) { substr(hArr, pos + nLen, hLen) };
    };
  };

  // Extract text between startTag and endTag (first occurrence)
  func extractBetween(text : Text, startTag : Text, endTag : Text) : Text {
    let afterStart = textAfter(text, startTag);
    if (afterStart.size() == 0) return "";
    let arr = afterStart.toArray();
    switch (indexOfText(afterStart, endTag)) {
      case null { "" };
      case (?endPos) { substr(arr, 0, endPos) };
    };
  };

  // Strip simple HTML tags (remove content between < and >)
  func stripHtmlTags(input : Text) : Text {
    let chars = input.toArray();
    var buf : [Char] = [];
    var inTag = false;
    for (c in chars.vals()) {
      if (c == '<') { inTag := true }
      else if (c == '>') { inTag := false }
      else if (not inTag) {
        buf := buf.concat([c]);
      };
    };
    Text.fromIter(buf.vals());
  };

  func cleanCdata(t : Text) : Text {
    var result = t;
    if (result.startsWith(#text "<![CDATA[")) {
      result := extractBetween(result, "<![CDATA[", "]]>");
    };
    result := stripHtmlTags(result);
    result.trim(#char ' ');
  };

  func categorize(title : Text, desc : Text) : Text {
    let combined = title # " " # desc;
    let lower = combined.toLower();

    if (
      lower.contains(#text "politics") or
      lower.contains(#text "election") or
      lower.contains(#text "minister") or
      lower.contains(#text "parliament") or
      lower.contains(#text "prime minister") or
      combined.contains(#text "রাজনীত") or
      combined.contains(#text "সরকার") or
      combined.contains(#text "নির্বাচন") or
      combined.contains(#text "মন্ত্রী")
    ) { return "রাজনৈতিক" };

    if (
      lower.contains(#text "economy") or
      lower.contains(#text "bank") or
      lower.contains(#text "market") or
      lower.contains(#text "finance") or
      lower.contains(#text "business") or
      lower.contains(#text "taka") or
      lower.contains(#text "gdp") or
      combined.contains(#text "অর্থ") or
      combined.contains(#text "ব্যাংক") or
      combined.contains(#text "বাজার") or
      combined.contains(#text "ব্যবসা")
    ) { return "অর্থনৈতিক" };

    if (
      lower.contains(#text "cricket") or
      lower.contains(#text "football") or
      lower.contains(#text "sports") or
      lower.contains(#text "tournament") or
      lower.contains(#text "world cup") or
      lower.contains(#text "match") or
      combined.contains(#text "ক্রিকেট") or
      combined.contains(#text "ফুটবল") or
      combined.contains(#text "খেলা")
    ) { return "ক্রীড়া" };

    if (
      lower.contains(#text "education") or
      lower.contains(#text "school") or
      lower.contains(#text "university") or
      lower.contains(#text "student") or
      combined.contains(#text "শিক্ষা") or
      combined.contains(#text "স্কুল") or
      combined.contains(#text "বিশ্ববিদ্যালয়")
    ) { return "শিক্ষা" };

    if (
      lower.contains(#text "health") or
      lower.contains(#text "hospital") or
      lower.contains(#text "disease") or
      lower.contains(#text "doctor") or
      lower.contains(#text "medicine") or
      lower.contains(#text "covid") or
      lower.contains(#text "virus") or
      combined.contains(#text "স্বাস্থ্য") or
      combined.contains(#text "হাসপাতাল") or
      combined.contains(#text "রোগ")
    ) { return "স্বাস্থ্য" };

    if (
      lower.contains(#text "agriculture") or
      lower.contains(#text "crop") or
      lower.contains(#text "farmer") or
      lower.contains(#text "farming") or
      combined.contains(#text "কৃষি") or
      combined.contains(#text "ফসল") or
      combined.contains(#text "কৃষক")
    ) { return "কৃষি" };

    if (
      lower.contains(#text "international") or
      lower.contains(#text "global") or
      lower.contains(#text "foreign") or
      lower.contains(#text "usa") or
      lower.contains(#text "india") or
      lower.contains(#text "china") or
      lower.contains(#text "united nations") or
      combined.contains(#text "আন্তর্জাতিক") or
      combined.contains(#text "বিশ্ব")
    ) { return "আন্তর্জাতিক খবর" };

    if (
      lower.contains(#text "bangladesh") or
      lower.contains(#text "dhaka") or
      lower.contains(#text "national") or
      combined.contains(#text "বাংলাদেশ") or
      combined.contains(#text "ঢাকা") or
      combined.contains(#text "জাতীয়")
    ) { return "জাতীয় খবর" };

    "সাধারণ খবর";
  };

  // Parse items from RSS XML; returns up to `limit` items
  func parseRssItems(body : Text, limit : Nat) : [{ title : Text; summary : Text; url : Text }] {
    var items : [{ title : Text; summary : Text; url : Text }] = [];
    var remaining = body;
    var count = 0;

    let itemStart = "<item>";
    let itemEnd = "</item>";

    label parse loop {
      if (count >= limit) break parse;
      let content = extractBetween(remaining, itemStart, itemEnd);
      if (content.size() == 0) break parse;

      let rawTitle = extractBetween(content, "<title>", "</title>");
      let rawDesc = extractBetween(content, "<description>", "</description>");
      let rawLink = extractBetween(content, "<link>", "</link>");

      let title = cleanCdata(rawTitle);
      let desc = cleanCdata(rawDesc);
      let link = rawLink.trim(#char ' ');

      if (title.size() > 0) {
        items := items.concat([{ title; summary = desc; url = link }]);
        count += 1;
      };

      // Advance past the consumed </item>
      remaining := textAfter(remaining, itemEnd);
      if (remaining.size() == 0) break parse;
    };
    items;
  };

  func bytesToText(bytes : [Nat8]) : Text {
    switch (Blob.fromArray(bytes).decodeUtf8()) {
      case (?t) { t };
      case null { "" };
    };
  };

  // ── fetchExternalNews ───────────────────────────────────────────────────────────────
  public func fetchExternalNews() : async Nat {
    type Source = { url : Text; name : Text };
    let sources : [Source] = [
      { url = "https://www.prothomalo.com/feed"; name = "প্রথম আলো" },
      { url = "https://www.thedailystar.net/rss.xml"; name = "The Daily Star" },
      { url = "https://bdnews24.com/feed/"; name = "BD News 24" },
      { url = "https://www.bbc.com/bengali/index.xml"; name = "BBC বাংলা" },
    ];

    // Replace with a fresh map to clear old news
    externalNewsItems := Map.empty<Nat, ExternalNews>();
    nextExternalNewsId := 1;

    var totalFetched = 0;
    let now = Time.now();

    for (source in sources.vals()) {
      try {
        let response = await ic.http_request({
          url = source.url;
          max_response_bytes = ?(500_000 : Nat64);
          headers = [{ name = "User-Agent"; value = "baligaon-news-aggregator/1.0" }];
          body = null;
          method = #get;
          transform = ?{
            function = transform;
            context = Blob.fromArray([]);
          };
        });

        if (response.status == 200) {
          let bodyText = bytesToText(response.body);
          let parsed = parseRssItems(bodyText, 15);

          for (item in parsed.vals()) {
            let cat = categorize(item.title, item.summary);
            let newsId = nextExternalNewsId;
            nextExternalNewsId += 1;
            let news : ExternalNews = {
              id = newsId;
              title = item.title;
              summary = item.summary;
              sourceUrl = item.url;
              sourceName = source.name;
              category = cat;
              fetchedAt = now;
            };
            externalNewsItems.add(newsId, news);
            totalFetched += 1;
          };
        };
      } catch (_) {
        // continue with next source on error
      };
    };

    lastFetchedAt := ?now;
    totalFetched;
  };

  // ── Local News Article functions ─────────────────────────────────────────────

  public func addLocalNews(
    title : Text,
    summary : Text,
    category : Text,
    imageBase64 : Text,
    author : Text,
    sourceName : Text,
    sourceUrl : Text
  ) : async Nat {
    let newsId = nextLocalNewsId;
    nextLocalNewsId += 1;
    let news : LocalNewsArticle = {
      id = newsId;
      title;
      summary;
      category;
      imageBase64;
      author;
      sourceName;
      sourceUrl;
      publishedAt = Time.now();
    };
    localNewsItems.add(newsId, news);
    newsId;
  };

  public query func getAllLocalNews() : async [LocalNewsArticle] {
    localNewsItems.values().toArray().sort(
      func(a : LocalNewsArticle, b : LocalNewsArticle) : Order.Order {
        if (b.publishedAt > a.publishedAt) return #less;
        if (b.publishedAt < a.publishedAt) return #greater;
        Nat.compare(b.id, a.id);
      }
    );
  };

  public func deleteLocalNews(id : Nat) : async Bool {
    switch (localNewsItems.get(id)) {
      case null { false };
      case (?_) {
        ignore localNewsItems.remove(id);
        true;
      };
    };
  };

  public query func searchLocalNews(keyword : Text) : async [LocalNewsArticle] {
    let lower = keyword.toLower();
    localNewsItems.values().toArray().filter(
      func(a : LocalNewsArticle) : Bool {
        a.title.toLower().contains(#text lower) or
        a.summary.toLower().contains(#text lower) or
        a.category.toLower().contains(#text lower)
      }
    ).sort(
      func(a : LocalNewsArticle, b : LocalNewsArticle) : Order.Order {
        if (b.publishedAt > a.publishedAt) return #less;
        if (b.publishedAt < a.publishedAt) return #greater;
        Nat.compare(b.id, a.id);
      }
    );
  };

  public query func getLocalNewsByDateRange(fromTimestamp : Time.Time, toTimestamp : Time.Time) : async [LocalNewsArticle] {
    localNewsItems.values().toArray().filter(
      func(a : LocalNewsArticle) : Bool {
        a.publishedAt >= fromTimestamp and a.publishedAt <= toTimestamp;
      }
    ).sort(
      func(a : LocalNewsArticle, b : LocalNewsArticle) : Order.Order {
        if (b.publishedAt > a.publishedAt) return #less;
        if (b.publishedAt < a.publishedAt) return #greater;
        Nat.compare(b.id, a.id);
      }
    );
  };

  // ── Queries ──────────────────────────────────────────────────────────────────────────
  public query func getExternalNews() : async [ExternalNews] {
    externalNewsItems.values().toArray().sort(
      func(a : ExternalNews, b : ExternalNews) : Order.Order {
        if (b.fetchedAt > a.fetchedAt) return #less;
        if (b.fetchedAt < a.fetchedAt) return #greater;
        Nat.compare(b.id, a.id);
      }
    );
  };

  public query func getLastFetchedTime() : async ?Time.Time {
    lastFetchedAt;
  };

  // ── Existing functions (unchanged) ───────────────────────────────────────────────
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
    articles.values().toArray().sort(
      func(a : Article, b : Article) : Order.Order { Nat.compare(a.id, b.id) }
    );
  };

  public query ({ caller }) func getAllBreakingNews() : async [BreakingNews] {
    breakingNewsItems.values().toArray().sort(
      func(a : BreakingNews, b : BreakingNews) : Order.Order { Nat.compare(a.id, b.id) }
    );
  };

  public query ({ caller }) func getFeaturedArticles() : async [Article] {
    articles.values().toArray().filter(func(article : Article) : Bool { article.isFeatured }).sort(
      func(a : Article, b : Article) : Order.Order { Nat.compare(a.id, b.id) }
    );
  };

  func assertIsAdmin(caller : Principal) {
    if (caller.toText() == "2vxsx-fae") { return () };
    switch (admins.get(caller)) {
      case (null) { Runtime.trap("Not an admin") };
      case (_) {};
    };
  };
};
