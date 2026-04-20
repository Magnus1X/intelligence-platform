import "dotenv/config";
import mongoose from "mongoose";
import { RoadmapModel } from "../models/Roadmap.model";
import { PracticeQuestionModel } from "../models/PracticeQuestion.model";

type Difficulty = "easy" | "medium" | "hard";

type SeedTestCase = {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
};

type SeedQuestion = {
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags?: string[];
  constraints?: string[];
  hints?: string[];
  starterCode: Record<string, string>;
  testCases: SeedTestCase[];
};

const testCase = (input: string, expectedOutput: unknown, isHidden = false): SeedTestCase => ({
  input,
  expectedOutput: JSON.stringify(expectedOutput),
  isHidden,
});

const normalizePythonBody = (body: string) => {
  const lines = body.replace(/\t/g, "    ").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return "";
  }

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^ */);
      return match ? match[0].length : 0;
    })
  );

  return lines
    .map((line) => (line.trim().length === 0 ? "" : `    ${line.slice(minIndent)}`))
    .join("\n");
};

const starterCode = (args: string, jsReturn: string, pyReturn: string) => ({
  javascript: `function solution(${args}) {\n  ${jsReturn}\n}`,
  python: `def solution(${args}):\n${normalizePythonBody(pyReturn)}`,
});

const practiceQuestion = ({
  title,
  description,
  difficulty,
  category,
  tags = [],
  constraints = [],
  hints = [],
  starterCode,
  testCases,
}: SeedQuestion) => ({
  title,
  description,
  difficulty,
  category,
  tags,
  constraints,
  examples: testCases.slice(0, 2).map((tc) => ({
    input: tc.input,
    output: tc.expectedOutput,
  })),
  hints,
  testCases,
  starterCode,
  acceptanceRate: 0,
  totalSubmissions: 0,
  totalAccepted: 0,
});

export const roadmapSeed = [
  {
    title: "Internship Preparation",
    type: "internship" as const,
    topics: [
      {
        title: "Arrays & Strings",
        description: "Master fundamental data structures and pattern recognition.",
        resources: ["LeetCode", "GeeksForGeeks"],
        order: 1,
      },
      {
        title: "Linked Lists",
        description: "Practice traversal, reversal, and fast/slow pointer techniques.",
        resources: ["NeetCode"],
        order: 2,
      },
      {
        title: "Stacks & Queues",
        description: "Learn LIFO/FIFO patterns and interview-friendly use cases.",
        resources: ["LeetCode"],
        order: 3,
      },
      {
        title: "Trees & Graphs",
        description: "Build confidence with DFS, BFS, recursion, and traversal order.",
        resources: ["VisuAlgo"],
        order: 4,
      },
      {
        title: "Dynamic Programming",
        description: "Use memoization and tabulation to solve recurring subproblems.",
        resources: ["DP Patterns"],
        order: 5,
      },
      {
        title: "System Design Basics",
        description: "Understand scalability, caching, load balancing, and tradeoffs.",
        resources: ["System Design Primer"],
        order: 6,
      },
      {
        title: "Build 2 Projects",
        description: "Create portfolio projects that show depth and shipping ability.",
        resources: ["GitHub"],
        order: 7,
      },
    ],
  },
  {
    title: "Placement Preparation",
    type: "placement" as const,
    topics: [
      {
        title: "Advanced DSA",
        description: "Go deeper into tries, segment trees, graphs, and greedy methods.",
        resources: ["CP-Algorithms"],
        order: 1,
      },
      {
        title: "OS Concepts",
        description: "Review processes, threads, scheduling, and memory management.",
        resources: ["OSTEP"],
        order: 2,
      },
      {
        title: "DBMS",
        description: "Cover SQL, normalization, indexes, and transactions.",
        resources: ["W3Schools"],
        order: 3,
      },
      {
        title: "Computer Networks",
        description: "Refresh TCP/IP, HTTP, DNS, latency, and reliability basics.",
        resources: ["Tanenbaum"],
        order: 4,
      },
      {
        title: "System Design Advanced",
        description: "Study distributed systems, queues, and service decomposition.",
        resources: ["Designing Data-Intensive Applications"],
        order: 5,
      },
      {
        title: "Behavioral Prep",
        description: "Practice STAR stories, ownership examples, and communication.",
        resources: ["Glassdoor"],
        order: 6,
      },
    ],
  },
];

export const practiceQuestionSeed = [
  practiceQuestion({
    title: "Two Sum",
    description: "Return the indices of the two numbers whose sum equals the target.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "hash-map"],
    constraints: ["Assume at most one valid pair is needed in the output."],
    hints: ["A hash map can store each value you have seen and its index."],
    starterCode: starterCode("nums, target", "return [];", "return []"),
    testCases: [
      testCase("[2,7,11,15], 9", [0, 1]),
      testCase("[3,2,4], 6", [1, 2]),
      testCase("[3,3], 6", [0, 1]),
      testCase("[1,2,3], 7", []),
      testCase("[0,4,3,0], 0", [0, 3]),
    ],
  }),
  practiceQuestion({
    title: "Best Time to Buy and Sell Stock",
    description: "Return the maximum profit you can achieve from one buy and one sell.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "greedy"],
    hints: ["Track the lowest price seen so far while scanning the array once."],
    starterCode: starterCode("prices", "return 0;", "return 0"),
    testCases: [
      testCase("[7,1,5,3,6,4]", 5),
      testCase("[7,6,4,3,1]", 0),
      testCase("[1,2,3,4,5]", 4),
      testCase("[2,4,1]", 2),
      testCase("[3,2,6,5,0,3]", 4),
    ],
  }),
  practiceQuestion({
    title: "Contains Duplicate",
    description: "Return true if any value appears at least twice in the array.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "hash-set"],
    starterCode: starterCode("nums", "return false;", "return False"),
    testCases: [
      testCase("[1,2,3,1]", true),
      testCase("[1,2,3,4]", false),
      testCase("[1,1,1,3,3,4]", true),
      testCase("[]", false),
      testCase("[0]", false),
    ],
  }),
  practiceQuestion({
    title: "Maximum Subarray",
    description: "Return the largest possible sum of a contiguous subarray.",
    difficulty: "medium",
    category: "arrays",
    tags: ["arrays", "dynamic-programming"],
    hints: ["Kadane's algorithm keeps a running best ending at each index."],
    starterCode: starterCode("nums", "return 0;", "return 0"),
    testCases: [
      testCase("[-2,1,-3,4,-1,2,1,-5,4]", 6),
      testCase("[1]", 1),
      testCase("[-1,-2,-3]", -1),
      testCase("[5,4,-1,7,8]", 23),
      testCase("[0,0,0]", 0),
    ],
  }),
  practiceQuestion({
    title: "Climbing Stairs",
    description: "Return the number of distinct ways to reach the nth stair.",
    difficulty: "easy",
    category: "dp",
    tags: ["dynamic-programming"],
    starterCode: starterCode("n", "return 0;", "return 0"),
    testCases: [
      testCase("2", 2),
      testCase("3", 3),
      testCase("5", 8),
      testCase("10", 89),
      testCase("1", 1),
    ],
  }),
  practiceQuestion({
    title: "Binary Search",
    description: "Return the index of target in a sorted array, or -1 if it is missing.",
    difficulty: "easy",
    category: "arrays",
    tags: ["binary-search"],
    starterCode: starterCode("nums, target", "return -1;", "return -1"),
    testCases: [
      testCase("[-1,0,3,5,9,12], 9", 4),
      testCase("[-1,0,3,5,9,12], 2", -1),
      testCase("[1,2,3], 1", 0),
      testCase("[1], 0", -1),
      testCase("[], 1", -1),
    ],
  }),
  practiceQuestion({
    title: "Valid Parentheses",
    description: "Return true if every opening bracket is closed in the correct order.",
    difficulty: "easy",
    category: "stack",
    tags: ["stack", "strings"],
    starterCode: starterCode("s", "return false;", "return False"),
    testCases: [
      testCase('"()"', true),
      testCase('"()[]{}"', true),
      testCase('"(]"', false),
      testCase('"([)]"', false),
      testCase('"{[]}"', true),
    ],
  }),
  practiceQuestion({
    title: "Merge Intervals",
    description: "Merge all overlapping intervals and return the condensed result.",
    difficulty: "medium",
    category: "greedy",
    tags: ["intervals", "sorting"],
    starterCode: starterCode("intervals", "return [];", "return []"),
    testCases: [
      testCase("[[1,3],[2,6],[8,10],[15,18]]", [[1, 6], [8, 10], [15, 18]]),
      testCase("[[1,4],[4,5]]", [[1, 5]]),
      testCase("[[1,4]]", [[1, 4]]),
      testCase("[]", []),
      testCase("[[1,4],[0,2],[3,5]]", [[0, 5]]),
    ],
  }),
  practiceQuestion({
    title: "Product of Array Except Self",
    description: "Return an array where each element is the product of all other values.",
    difficulty: "medium",
    category: "arrays",
    tags: ["arrays", "prefix-suffix"],
    hints: ["Build prefix and suffix products without using division."],
    starterCode: starterCode("nums", "return [];", "return []"),
    testCases: [
      testCase("[1,2,3,4]", [24, 12, 8, 6]),
      testCase("[-1,1,0,-3,3]", [0, 0, 9, 0, 0]),
      testCase("[2,3,4,5]", [60, 40, 30, 24]),
      testCase("[1,1,1,1]", [1, 1, 1, 1]),
      testCase("[0,0]", [0, 0]),
    ],
  }),
  practiceQuestion({
    title: "Longest Substring Without Repeating Characters",
    description: "Return the length of the longest substring with all unique characters.",
    difficulty: "medium",
    category: "sliding-window",
    tags: ["strings", "sliding-window"],
    starterCode: starterCode("s", "return 0;", "return 0"),
    testCases: [
      testCase('"abcabcbb"', 3),
      testCase('"bbbbb"', 1),
      testCase('"pwwkew"', 3),
      testCase('""', 0),
      testCase('"dvdf"', 3),
    ],
  }),
  practiceQuestion({
    title: "Valid Palindrome",
    description: "Ignore casing and non-alphanumeric characters, then check for a palindrome.",
    difficulty: "easy",
    category: "strings",
    tags: ["strings", "two-pointers"],
    starterCode: starterCode("s", "return false;", "return False"),
    testCases: [
      testCase('"A man, a plan, a canal: Panama"', true),
      testCase('"race a car"', false),
      testCase('""', true),
      testCase('"a"', true),
      testCase('"ab"', false),
    ],
  }),
  practiceQuestion({
    title: "Single Number",
    description: "Every element appears twice except one. Return the unique value.",
    difficulty: "easy",
    category: "bit-manipulation",
    tags: ["bit-manipulation", "arrays"],
    starterCode: starterCode("nums", "return 0;", "return 0"),
    testCases: [
      testCase("[2,2,1]", 1),
      testCase("[4,1,2,1,2]", 4),
      testCase("[1]", 1),
      testCase("[0,0,99]", 99),
      testCase("[7,7,8]", 8),
    ],
  }),
  practiceQuestion({
    title: "Missing Number",
    description: "Return the missing number from the range 0 to n.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "math"],
    starterCode: starterCode("nums", "return 0;", "return 0"),
    testCases: [
      testCase("[3,0,1]", 2),
      testCase("[0,1]", 2),
      testCase("[9,6,4,2,3,5,7,0,1]", 8),
      testCase("[0]", 1),
      testCase("[1]", 0),
    ],
  }),
  practiceQuestion({
    title: "Intersection of Two Arrays",
    description: "Return the sorted unique intersection of the two input arrays.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "hash-set"],
    starterCode: starterCode("nums1, nums2", "return [];", "return []"),
    testCases: [
      testCase("[1,2,2,1], [2,2]", [2]),
      testCase("[4,9,5], [9,4,9,8,4]", [4, 9]),
      testCase("[], []", []),
      testCase("[1], [1]", [1]),
      testCase("[1,2], [3,4]", []),
    ],
  }),
  practiceQuestion({
    title: "Valid Anagram",
    description: "Return true if the second string is an anagram of the first.",
    difficulty: "easy",
    category: "strings",
    tags: ["strings", "hash-map"],
    starterCode: starterCode("s, t", "return false;", "return False"),
    testCases: [
      testCase('"anagram", "nagaram"', true),
      testCase('"rat", "car"', false),
      testCase('"", ""', true),
      testCase('"a", "a"', true),
      testCase('"ab", "a"', false),
    ],
  }),
  practiceQuestion({
    title: "Majority Element",
    description: "Return the element that appears more than n / 2 times.",
    difficulty: "easy",
    category: "arrays",
    tags: ["arrays", "boyer-moore"],
    starterCode: starterCode("nums", "return 0;", "return 0"),
    testCases: [
      testCase("[3,2,3]", 3),
      testCase("[2,2,1,1,1,2,2]", 2),
      testCase("[1]", 1),
      testCase("[6,5,5]", 5),
      testCase("[4,4,4,2,4]", 4),
    ],
  }),
  practiceQuestion({
    title: "Fibonacci Number",
    description: "Return the nth Fibonacci number with F(0) = 0 and F(1) = 1.",
    difficulty: "easy",
    category: "dp",
    tags: ["dynamic-programming", "math"],
    starterCode: starterCode("n", "return 0;", "return 0"),
    testCases: [
      testCase("2", 1),
      testCase("3", 2),
      testCase("5", 5),
      testCase("0", 0),
      testCase("10", 55),
    ],
  }),
  practiceQuestion({
    title: "House Robber",
    description: "Return the maximum amount you can rob without taking adjacent houses.",
    difficulty: "medium",
    category: "dp",
    tags: ["dynamic-programming"],
    starterCode: starterCode("nums", "return 0;", "return 0"),
    testCases: [
      testCase("[1,2,3,1]", 4),
      testCase("[2,7,9,3,1]", 12),
      testCase("[2,1,1,2]", 4),
      testCase("[1]", 1),
      testCase("[0,0]", 0),
    ],
  }),
  practiceQuestion({
    title: "Coin Change",
    description: "Return the fewest coins needed to make the amount, or -1 if impossible.",
    difficulty: "medium",
    category: "dp",
    tags: ["dynamic-programming"],
    starterCode: starterCode("coins, amount", "return -1;", "return -1"),
    testCases: [
      testCase("[1,2,5], 11", 3),
      testCase("[2], 3", -1),
      testCase("[1], 0", 0),
      testCase("[1], 1", 1),
      testCase("[1,3,4], 6", 2),
    ],
  }),
  practiceQuestion({
    title: "Number of Islands",
    description: "Return the number of connected groups of land cells in the grid.",
    difficulty: "medium",
    category: "graphs",
    tags: ["graphs", "dfs", "bfs"],
    starterCode: starterCode("grid", "return 0;", "return 0"),
    testCases: [
      testCase('[["1","1","0"],["1","0","0"],["0","0","1"]]', 2),
      testCase('[["1","1"],["1","1"]]', 1),
      testCase('[["0"]]', 0),
      testCase("[]", 0),
      testCase('[["1","0","1"]]', 2),
    ],
  }),
  practiceQuestion({
    title: "Top K Frequent Elements",
    description: "Return the k most frequent elements ordered by frequency descending and value ascending for ties.",
    difficulty: "medium",
    category: "heap",
    tags: ["heap", "hash-map"],
    starterCode: starterCode("nums, k", "return [];", "return []"),
    testCases: [
      testCase("[1,1,1,2,2,3], 2", [1, 2]),
      testCase("[1], 1", [1]),
      testCase("[4,4,4,6,6,7], 1", [4]),
      testCase("[1,2,3], 3", [1, 2, 3]),
      testCase("[5,5,5,5], 1", [5]),
    ],
  }),
  practiceQuestion({
    title: "Word Break",
    description: "Return true if the string can be segmented into words from the dictionary.",
    difficulty: "medium",
    category: "dp",
    tags: ["dynamic-programming", "strings"],
    starterCode: starterCode("s, wordDict", "return false;", "return False"),
    testCases: [
      testCase('"leetcode", ["leet","code"]', true),
      testCase('"applepenapple", ["apple","pen"]', true),
      testCase('"catsandog", ["cats","dog","sand","and","cat"]', false),
      testCase('"a", ["a"]', true),
      testCase('"aaaaaaa", ["aaaa","aaa"]', true),
    ],
  }),
];

export async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  try {
    await RoadmapModel.deleteMany({});
    await PracticeQuestionModel.deleteMany({});

    await RoadmapModel.insertMany(roadmapSeed);
    await PracticeQuestionModel.insertMany(practiceQuestionSeed);

    console.log(`Seed complete: ${roadmapSeed.length} roadmaps, ${practiceQuestionSeed.length} practice questions`);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  });
}
