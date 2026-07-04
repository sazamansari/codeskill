import { mkP, bp } from "./index";

// ═══════════════════════════════════
//  DSA / PROGRAMMING PROBLEMS (1-100)
//  Topics: Arrays, Strings, Linked Lists, Stacks, Trees, Graphs, DP, Binary Search, Heaps, Backtracking, Bit
// ═══════════════════════════════════

export const DSA_PROBLEMS = [
  // ── Arrays (1-16) ──
  mkP(1,"Two Sum","Easy","Programming",["Array","Hash Table"],`Given an array \`nums\` and an integer \`target\`, return indices of the two numbers that add up to \`target\`. Each input has exactly one solution.`,"nums=[2,7,11,15], target=9","[0,1]",["2<=nums.length<=10⁴","-10⁹<=nums[i]<=10⁹"],"[2,7,11,15]\n9","[0,1]",bp("twoSum","nums: list[int], target: int","int[]","int[] nums, int target","vector<int>","vector<int>& nums, int target","{number[]} nums, {number} target")),
  mkP(2,"Best Time to Buy and Sell Stock","Easy","Programming",["Array","Greedy"],`Given array \`prices\` where \`prices[i]\` is stock price on day i, return max profit from one buy and one sell.`,"prices=[7,1,5,3,6,4]","5",["1<=prices.length<=10⁵"],"[7,1,5,3,6,4]","5",bp("maxProfit","prices: list[int]","int","int[] prices","int","vector<int>& prices","{number[]} prices")),
  mkP(3,"Contains Duplicate","Easy","Programming",["Array","Hash Table"],`Return \`true\` if any value appears at least twice in the array.`,"nums=[1,2,3,1]","true",["1<=nums.length<=10⁵"],"[1,2,3,1]","true",bp("containsDuplicate","nums: list[int]","boolean","int[] nums","bool","vector<int>& nums","{number[]} nums")),
  mkP(4,"Maximum Subarray","Medium","Programming",["Array","DP"],`Find the contiguous subarray with the largest sum (Kadane's Algorithm).`,"nums=[-2,1,-3,4,-1,2,1,-5,4]","6",["1<=nums.length<=10⁵"],"[-2,1,-3,4,-1,2,1,-5,4]","6",bp("maxSubArray","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(5,"Product of Array Except Self","Medium","Programming",["Array","Prefix Sum"],`Return array where answer[i] equals the product of all elements except nums[i]. O(n) without division.`,"nums=[1,2,3,4]","[24,12,8,6]",["2<=nums.length<=10⁵"],"[1,2,3,4]","[24,12,8,6]",bp("productExceptSelf","nums: list[int]","int[]","int[] nums","vector<int>","vector<int>& nums","{number[]} nums")),
  mkP(6,"3Sum","Medium","Programming",["Array","Two Pointers"],`Return all triplets that sum to zero. No duplicate triplets.`,"nums=[-1,0,1,2,-1,-4]","[[-1,-1,2],[-1,0,1]]",["3<=nums.length<=3000"],"[-1,0,1,2,-1,-4]","[[-1,-1,2],[-1,0,1]]",bp("threeSum","nums: list[int]","List<List<Integer>>","int[] nums","vector<vector<int>>","vector<int>& nums","{number[]} nums")),
  mkP(7,"Container With Most Water","Medium","Programming",["Array","Two Pointers"],`Find two lines forming the container that holds the most water.`,"height=[1,8,6,2,5,4,8,3,7]","49",["2<=n<=10⁵"],"[1,8,6,2,5,4,8,3,7]","49",bp("maxArea","height: list[int]","int","int[] height","int","vector<int>& height","{number[]} height")),
  mkP(8,"Merge Intervals","Medium","Programming",["Array","Sorting"],`Merge all overlapping intervals.`,"intervals=[[1,3],[2,6],[8,10],[15,18]]","[[1,6],[8,10],[15,18]]",["1<=intervals.length<=10⁴"],"[[1,3],[2,6],[8,10],[15,18]]","[[1,6],[8,10],[15,18]]",bp("merge","intervals: list[list[int]]","int[][]","int[][] intervals","vector<vector<int>>","vector<vector<int>>& intervals","{number[][]} intervals")),
  mkP(9,"Sort Colors","Medium","Programming",["Array","Two Pointers"],`Sort array of 0s, 1s, 2s in-place (Dutch National Flag).`,"nums=[2,0,2,1,1,0]","[0,0,1,1,2,2]",["1<=n<=300"],"[2,0,2,1,1,0]","[0,0,1,1,2,2]",bp("sortColors","nums: list[int]","void","int[] nums","void","vector<int>& nums","{number[]} nums")),
  mkP(10,"Next Permutation","Medium","Programming",["Array"],`Find the next lexicographically greater permutation in-place.`,"nums=[1,2,3]","[1,3,2]",["1<=nums.length<=100"],"[1,2,3]","[1,3,2]",bp("nextPermutation","nums: list[int]","void","int[] nums","void","vector<int>& nums","{number[]} nums")),

  // Continue pattern for problems 11-100...
  // Copy remaining problems from the monolithic codeskill-platform.jsx file
  // Full list: Trapping Rain Water(11), Rotate Array(12), Missing Number(13), Move Zeroes(14), Majority Element(15),
  // Find First/Last Position(16), Valid Parentheses(17), Longest Substring(18), Palindromic Substring(19),
  // Group Anagrams(20), ... through Single Number(99), Counting Bits(100)

  // ── Strings (17-28) ──
  mkP(17,"Valid Parentheses","Easy","Programming",["String","Stack"],`Determine if input string of brackets (){}[] is valid.`,'s="()[]{}"',"true",["1<=s.length<=10⁴"],"()[]{}","true",bp("isValid","s: str","boolean","String s","bool","string s","{string} s")),
  mkP(18,"Longest Substring Without Repeating","Medium","Programming",["String","Sliding Window"],`Find length of longest substring without repeating characters.`,'s="abcabcbb"',"3",["0<=s.length<=5×10⁴"],"abcabcbb","3",bp("lengthOfLongestSubstring","s: str","int","String s","int","string s","{string} s")),

  // ── Linked Lists (29-38) ──
  mkP(29,"Reverse Linked List","Easy","Programming",["Linked List","Recursion"],`Reverse a singly linked list.`,"head=[1,2,3,4,5]","[5,4,3,2,1]",["0<=n<=5000"],"[1,2,3,4,5]","[5,4,3,2,1]",bp("reverseList","head: ListNode","ListNode","ListNode head","ListNode*","ListNode* head","{ListNode} head")),

  // ── Trees (46-57) ──
  mkP(46,"Maximum Depth of Binary Tree","Easy","Programming",["Tree","DFS"],`Return the maximum depth of a binary tree.`,"root=[3,9,20,null,null,15,7]","3",["0<=n<=10⁴"],"[3,9,20,null,null,15,7]","3",bp("maxDepth","root: TreeNode","int","TreeNode root","int","TreeNode* root","{TreeNode} root")),

  // ── DP (68-82) ──
  mkP(68,"Climbing Stairs","Easy","Programming",["DP","Math"],`Count distinct ways to climb n steps (1 or 2 at a time).`,"n=3","3",["1<=n<=45"],"3","3",bp("climbStairs","n: int","int","int n","int","int n","{number} n")),
  mkP(70,"Coin Change","Medium","Programming",["DP","BFS"],`Fewest coins to make amount. Return -1 if impossible.`,"coins=[1,5,11],amount=11","1",["1<=coins.length<=12"],"[1,5,11]\n11","1",bp("coinChange","coins: list[int], amount: int","int","int[] coins, int amount","int","vector<int>& coins, int amount","{number[]} coins, {number} amount")),

  // ── Binary Search (83-88) ──
  mkP(83,"Binary Search","Easy","Programming",["Array","Binary Search"],`Search for target in sorted array. O(log n).`,"nums=[-1,0,3,5,9,12],target=9","4",["1<=n<=10⁴"],"[-1,0,3,5,9,12]\n9","4",bp("search","nums: list[int], target: int","int","int[] nums, int target","int","vector<int>& nums, int target","{number[]} nums, {number} target")),

  // ── Backtracking (94-98) ──
  mkP(96,"Permutations","Medium","Programming",["Backtracking"],`Return all permutations of distinct integers.`,"nums=[1,2,3]","6 permutations",["1<=n<=6"],"[1,2,3]","[[1,2,3],...]",bp("permute","nums: list[int]","List<List<Integer>>","int[] nums","vector<vector<int>>","vector<int>& nums","{number[]} nums")),

  // ── Bit Manipulation (99-100) ──
  mkP(99,"Single Number","Easy","Programming",["Bit Manipulation"],`Every element appears twice except one. Find it.`,"nums=[4,1,2,1,2]","4",["1<=n<=3×10⁴"],"[4,1,2,1,2]","4",bp("singleNumber","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(100,"Counting Bits","Easy","Programming",["DP","Bit"],`Return array where ans[i] is number of 1s in binary of i.`,"n=5","[0,1,1,2,1,2]",["0<=n<=10⁵"],"5","[0,1,1,2,1,2]",bp("countBits","n: int","int[]","int n","vector<int>","int n","{number} n")),
];
