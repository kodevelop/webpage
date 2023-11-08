const fs = require("fs");
const path = require("path");
const summarizerManager = require("node-summarizer").SummarizerManager;

const main = async () => {
  const blogPostsDir = "src/assets/content/blog-posts";
  const blogListPath = "src/assets/content/blog-list.json";

  // Read the list of markdown files in the blog-posts folder
  const markdownFiles = fs
    .readdirSync(blogPostsDir)
    .filter((file) => file.endsWith(".md"));

  // Create an array to store the blog posts
  const blogList = [];

  // Loop through the markdown files to generate the blog list
  let index = 0;
  for (const file of markdownFiles) {
    const id = index + 1;
    const markdownContent = fs.readFileSync(
      path.join(blogPostsDir, file),
      "utf8"
    );
    const titleMatch = markdownContent.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1] : "Untitled";
    const slug = file.toLowerCase().replace(/\s+/g, "-").replace(/\.md$/, "");

    // Use the node-summarizer library to generate a summary
    const summarizer = new summarizerManager(markdownContent, 5);
    //const summaryF = summarizer.getSummaryByFrequency().summary;
    const summaryR = await summarizer.getSummaryByRank();

    blogList.push({
      id,
      title,
      slug,
      summary: summaryR.summary,
    });
  };

  // Create an object with the "blogs" property
  const blogListData = { blogs: blogList };

  // Write the JSON data to the blog-list.json file
  fs.writeFileSync(blogListPath, JSON.stringify(blogListData, null, 2));

  console.log(
    `Generated ${markdownFiles.length} blog posts in ${blogListPath}`
  );
};

main();
