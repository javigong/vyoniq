import { TwitterApi } from "twitter-api-v2";

// X (Twitter) API client instance
let twitterClient: TwitterApi | null = null;

// Initialize Twitter client with credentials
function initializeTwitterClient(): TwitterApi {
  if (!twitterClient) {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      throw new Error(
        "Missing Twitter API credentials in environment variables"
      );
    }

    twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessTokenSecret,
    });
  }

  return twitterClient;
}

// Generate hashtags based on blog post categories
function generateHashtags(categories: string[]): string[] {
  const hashtagMap: Record<string, string> = {
    "AI Development Tools": "#AI",
    "Cursor & AI IDEs": "#Cursor",
    "Industry Trends": "#Tech",
    "MCP Servers": "#MCP",
    "LLM Integration": "#LLM",
    "Enterprise Architecture": "#Enterprise",
    "AI Agents": "#AIAgents",
    "Business Automation": "#Automation",
    "Case Studies": "#CaseStudy",
  };

  const hashtags = categories
    .map(
      (category) =>
        hashtagMap[category] || `#${category.replace(/[^a-zA-Z0-9]/g, "")}`
    )
    .slice(0, 3); // Limit to 3 hashtags

  // Always include core Vyoniq hashtags
  const coreHashtags = ["#SoftwareDevelopment", "#TechBlog"];

  return Array.from(new Set([...hashtags, ...coreHashtags])).slice(0, 4); // Max 4 hashtags
}

// Generate tweet content for a blog post
function generateTweetContent(
  title: string,
  excerpt: string,
  slug: string,
  categories: string[],
  isUpdate: boolean = false
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vyoniq.com";
  const blogUrl = `${baseUrl}/blog/${slug}`;

  const prefix = isUpdate ? "📝 Updated:" : "🚀 New Post:";
  const hashtags = generateHashtags(categories).join(" ");

  // Dynamic URL length detection with safety buffer
  const tcoUrlLength = 23; // Standard t.co length
  const urlLengthBuffer = 2; // Safety buffer for URL length variations
  const effectiveUrlLength = tcoUrlLength + urlLengthBuffer;

  // Calculate available space using MOCK shortened URL for accurate calculation
  // Tweet format: "{prefix} {content}\n\n🔗 {shortenedUrl}\n\n{hashtags}"
  const mockShortenedUrl = "https://t.co/xxxxxxxxxx"; // 23 chars - standard t.co format
  const prefixLength = prefix.length + 1; // +1 for space after prefix
  const urlPrefixLength = 3; // "🔗 " (emoji + space)
  const hashtagsLength = hashtags.length;
  const newlinesLength = 4; // Two sets of double newlines (\n\n)

  const fixedOverhead =
    prefixLength +
    urlPrefixLength +
    effectiveUrlLength +
    hashtagsLength +
    newlinesLength;
  const availableSpace = 280 - fixedOverhead;

  let content = title;

  // If title is too long, truncate it
  if (content.length > availableSpace) {
    content = content.substring(0, availableSpace - 3) + "...";
  } else if (content.length < availableSpace - 20) {
    // If we have space, add a brief excerpt
    const remainingSpace = availableSpace - content.length - 3; // -3 for " - "
    if (excerpt.length <= remainingSpace) {
      content += ` - ${excerpt}`;
    } else {
      const truncatedExcerpt = excerpt.substring(0, remainingSpace - 3) + "...";
      content += ` - ${truncatedExcerpt}`;
    }
  }

  // Create tweet using MOCK URL for length calculation, but we'll use real URL in final output
  const mockTweet = `${prefix} ${content}

🔗 ${mockShortenedUrl}

${hashtags}`;

  // Validate mock tweet length and adjust content if necessary
  if (mockTweet.length > 280) {
    console.warn(
      `Tweet calculation exceeds 280 characters (${mockTweet.length}), adjusting content...`
    );

    // Calculate exact excess and remove precisely what's needed
    const excess = mockTweet.length - 280;
    const ellipsis = "...";
    const newContentLength = content.length - excess - ellipsis.length;

    if (newContentLength > 10) {
      content = content.substring(0, newContentLength) + ellipsis;
    } else {
      // Fallback: use only title, truncated if necessary
      const maxTitleLength = availableSpace - ellipsis.length;
      content =
        title.length > maxTitleLength
          ? title.substring(0, maxTitleLength) + ellipsis
          : title;
    }
  }

  // Create final tweet with actual URL
  const finalTweet = `${prefix} ${content}

🔗 ${blogUrl}

${hashtags}`;

  // Final safety check with optimized emergency truncation
  if (finalTweet.length > 280) {
    console.warn(
      `Final tweet exceeds 280 characters (${finalTweet.length}), applying emergency truncation...`
    );

    const excess = finalTweet.length - 280;
    const ellipsis = "...";
    let adjustedContent = content;

    // Binary search approach for optimal truncation
    let left = 0;
    let right = content.length;
    let bestContent = content.substring(0, 10) + ellipsis; // Fallback

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const testContent = content.substring(0, mid) + ellipsis;
      const testTweet = `${prefix} ${testContent}

🔗 ${blogUrl}

${hashtags}`;

      if (testTweet.length <= 280) {
        bestContent = testContent;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    const emergencyTweet = `${prefix} ${bestContent}

🔗 ${blogUrl}

${hashtags}`;

    console.log(
      `Emergency truncation applied: ${emergencyTweet.length}/280 characters`
    );
    return emergencyTweet;
  }

  return finalTweet;
}

// Publish a tweet for a blog post
export async function publishBlogPostTweet(
  title: string,
  excerpt: string,
  slug: string,
  categories: string[],
  isUpdate: boolean = false
): Promise<{ success: boolean; message: string }> {
  try {
    // Skip if Twitter credentials are not configured
    if (!process.env.TWITTER_API_KEY) {
      console.log(
        "Twitter API credentials not configured, skipping tweet publication"
      );
      return {
        success: true,
        message: "Twitter integration disabled - no credentials configured",
      };
    }

    const client = initializeTwitterClient();
    const tweetContent = generateTweetContent(
      title,
      excerpt,
      slug,
      categories,
      isUpdate
    );

    console.log("Publishing tweet:", tweetContent);

    const response = await client.v2.tweet(tweetContent);

    if (response.data) {
      const tweetUrl = `https://x.com/vyoniq/status/${response.data.id}`;
      console.log(`Successfully published tweet: ${tweetUrl}`);
      return {
        success: true,
        message: `Tweet published successfully: ${tweetUrl}`,
      };
    } else {
      console.error("Failed to publish tweet - no data in response");
      return {
        success: false,
        message: "Failed to publish tweet - no data in response",
      };
    }
  } catch (error) {
    console.error("Error publishing tweet:", error);

    // Handle specific Twitter API errors gracefully
    if (error instanceof Error) {
      // Rate limit error
      if (error.message.includes("rate limit")) {
        return {
          success: false,
          message:
            "Tweet publishing failed: Rate limit exceeded. Try again later.",
        };
      }

      // Duplicate tweet error
      if (error.message.includes("duplicate")) {
        return {
          success: false,
          message: "Tweet publishing skipped: Duplicate content detected.",
        };
      }

      return {
        success: false,
        message: `Tweet publishing failed: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "Tweet publishing failed: Unknown error",
    };
  }
}

// Test function to validate tweet length calculation
export function testTweetLength(
  title: string,
  excerpt: string,
  slug: string,
  categories: string[] = ["AI Development Tools"],
  isUpdate: boolean = false
): { tweet: string; length: number; withinLimit: boolean } {
  const tweet = generateTweetContent(
    title,
    excerpt,
    slug,
    categories,
    isUpdate
  );
  return {
    tweet,
    length: tweet.length,
    withinLimit: tweet.length <= 280,
  };
}

// Test function to verify Twitter API connection
export async function testTwitterConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (!process.env.TWITTER_API_KEY) {
      return {
        success: false,
        message: "Twitter API credentials not configured",
      };
    }

    const client = initializeTwitterClient();
    const user = await client.v2.me();

    return {
      success: true,
      message: `Successfully connected to Twitter API as @${user.data.username}`,
    };
  } catch (error) {
    console.error("Twitter connection test failed:", error);
    return {
      success: false,
      message: `Twitter connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
