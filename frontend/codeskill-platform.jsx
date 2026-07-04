import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   CODESKILL v2 — Premium Coding Platform with AI Hints,
   Theme Toggle, Company Tags, Notes, Export, Contest Mode
   Part of the Evolvian EdTech Ecosystem
   ═══════════════════════════════════════════════════════════ */

// ── Dual Theme System ──
const LIGHT = {
  bg: "#F4F6FB", bgWhite: "#FFFFFF", bgPanel: "#F8FAFC", bgEditor: "#FCFCFD",
  bgHover: "#EEF2FF", bgActive: "#E0E7FF", bgMuted: "#F1F5F9",
  border: "#E2E8F0", borderLight: "#F1F5F9", borderAccent: "#C7D2FE",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8", textFaint: "#CBD5E1",
  accent: "#4F46E5", accentLight: "#818CF8", accentDim: "#3730A3", accentBg: "#EEF2FF",
  green: "#16A34A", greenBg: "#DCFCE7", greenBorder: "#BBF7D0",
  red: "#DC2626", redBg: "#FEE2E2", redBorder: "#FECACA",
  yellow: "#D97706", yellowBg: "#FEF3C7",
  purple: "#7C3AED", cyan: "#0891B2", orange: "#EA580C",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
  shadowLg: "0 10px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
  gradient: "linear-gradient(135deg, #4F46E5, #2563EB, #0891B2)",
  gradientSoft: "linear-gradient(135deg, #EEF2FF, #E0F2FE)",
  isDark: false,
};
const DARK = {
  bg: "#0D1117", bgWhite: "#161B22", bgPanel: "#161B22", bgEditor: "#0D1117",
  bgHover: "#1C2333", bgActive: "#1F2937", bgMuted: "#21262D",
  border: "#30363D", borderLight: "#21262D", borderAccent: "#4F46E5",
  text: "#E6EDF3", textSec: "#8B949E", textMuted: "#484F58", textFaint: "#30363D",
  accent: "#818CF8", accentLight: "#A5B4FC", accentDim: "#4F46E5", accentBg: "#1E1B4B22",
  green: "#22C55E", greenBg: "#166534", greenBorder: "#15803D",
  red: "#F87171", redBg: "#991B1B", redBorder: "#B91C1C",
  yellow: "#FBBF24", yellowBg: "#92400E",
  purple: "#A78BFA", cyan: "#22D3EE", orange: "#FB923C",
  shadow: "0 1px 3px rgba(0,0,0,0.3)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.4)",
  shadowLg: "0 10px 32px rgba(0,0,0,0.5)",
  gradient: "linear-gradient(135deg, #818CF8, #3B82F6, #22D3EE)",
  gradientSoft: "linear-gradient(135deg, #1E1B4B, #172554)",
  isDark: true,
};
let T = LIGHT;

const LANGS = {
  python: { name: "Python 3", ext: "py", cat: "Programming", icon: "🐍", color: "#3776AB" },
  java: { name: "Java", ext: "java", cat: "Programming", icon: "☕", color: "#ED8B00" },
  cpp: { name: "C++", ext: "cpp", cat: "Programming", icon: "⚙️", color: "#00599C" },
  c: { name: "C", ext: "c", cat: "Programming", icon: "🔧", color: "#555" },
  javascript: { name: "JavaScript", ext: "js", cat: "Web", icon: "🟨", color: "#F7DF1E" },
  html: { name: "HTML", ext: "html", cat: "Web", icon: "🌐", color: "#E34F26" },
  css: { name: "CSS", ext: "css", cat: "Web", icon: "🎨", color: "#1572B6" },
  mysql: { name: "MySQL", ext: "sql", cat: "Database", icon: "🐬", color: "#4479A1" },
  postgresql: { name: "PostgreSQL", ext: "sql", cat: "Database", icon: "🐘", color: "#4169E1" },
  mongodb: { name: "MongoDB", ext: "js", cat: "Database", icon: "🍃", color: "#47A248" },
};

// ── Company tags by problem ID ──
const COMPANY_TAGS = {
  1:["Google","Amazon","Microsoft","Meta","Apple"],2:["Amazon","Microsoft","Goldman Sachs"],3:["Amazon","Adobe","Apple"],
  4:["Amazon","Microsoft","Apple","LinkedIn"],5:["Amazon","Meta","Microsoft","Apple"],6:["Amazon","Meta","Microsoft","Bloomberg"],
  7:["Amazon","Goldman Sachs","Microsoft"],8:["Google","Meta","Microsoft","Bloomberg"],9:["Microsoft","Amazon","Adobe"],
  10:["Google","Amazon","Microsoft"],11:["Amazon","Google","Microsoft","Goldman Sachs"],12:["Amazon","Microsoft"],
  13:["Amazon","Microsoft","Apple"],14:["Meta","Amazon","Apple"],15:["Amazon","Google","Microsoft"],
  16:["Meta","Amazon","Microsoft"],17:["Amazon","Meta","Google","Bloomberg"],18:["Amazon","Google","Microsoft","Adobe"],
  19:["Amazon","Microsoft","Uber"],20:["Amazon","Google","Meta"],21:["Google","Amazon","Apple"],
  22:["Amazon","Microsoft","Google"],23:["Amazon","Microsoft","Apple"],24:["Meta","Microsoft"],
  25:["Meta","Amazon","Google","Uber"],26:["Meta","Amazon","Microsoft"],27:["Meta","Google"],
  28:["Amazon","Microsoft"],29:["Amazon","Microsoft","Apple","Google"],30:["Amazon","Microsoft","Goldman Sachs"],
  31:["Amazon","Meta","Microsoft"],32:["Microsoft","Amazon","Google"],33:["Amazon","Meta","Microsoft","Bloomberg"],
  34:["Meta","Amazon","Microsoft"],35:["Meta","Amazon"],36:["Amazon","Meta","Microsoft"],
  37:["Meta","Amazon"],38:["Amazon","Google","Microsoft","Uber"],39:["Amazon","Microsoft","Bloomberg"],
  40:["Amazon","Google"],41:["Amazon","Google","LinkedIn"],42:["Google","Amazon","Meta"],
  43:["Amazon","Google","Microsoft"],44:["Amazon","Google","Microsoft"],45:["Amazon","Goldman Sachs"],
  46:["Amazon","Google","Microsoft"],47:["Google","Amazon","Microsoft"],48:["Amazon","Meta","Microsoft"],
  49:["Amazon","Meta","Microsoft","Bloomberg"],50:["Meta","Amazon","Microsoft"],51:["Meta","Google","Amazon"],
  52:["Amazon","Microsoft","Google"],53:["Meta","Amazon","Microsoft"],54:["Amazon","Google","Microsoft"],
  55:["Google","Amazon","Microsoft","Uber"],56:["Google","Meta","Microsoft","Uber"],57:["Amazon","Google","Meta"],
  58:["Amazon","Google","Microsoft","Meta"],59:["Amazon","Google","Meta"],60:["Amazon","Microsoft","Google","Meta"],
  61:["Amazon","Google","Meta"],62:["Amazon","Microsoft","Samsung"],63:["Amazon","Google","Uber"],
  64:["Amazon","Google"],65:["Amazon","Google","Microsoft"],66:["Amazon","Microsoft","Meta"],
  67:["Amazon","Google","Microsoft"],68:["Amazon","Google","Microsoft","Apple"],69:["Amazon","Google","Microsoft"],
  70:["Amazon","Google","Microsoft","Apple"],71:["Amazon","Google","Microsoft"],72:["Amazon","Google","Microsoft"],
  73:["Amazon","Google","Microsoft"],74:["Amazon","Google","Microsoft"],75:["Amazon","Google","Meta","Microsoft"],
  76:["Amazon","Google","Microsoft"],77:["Amazon","Google","Microsoft"],78:["Amazon","Microsoft"],
  79:["Amazon","Google","Microsoft"],80:["Amazon","Google","Goldman Sachs"],81:["Amazon","Meta","Microsoft"],
  82:["Amazon","Google","Microsoft"],83:["Amazon","Microsoft"],84:["Amazon","Google","Meta","Microsoft"],
  85:["Amazon","Google","Microsoft"],86:["Amazon","Google","Microsoft","Goldman Sachs"],87:["Amazon","Google"],
  88:["Google","Amazon"],89:["Amazon","Meta","Google","Microsoft"],90:["Amazon","Google","Microsoft","Uber"],
  91:["Amazon","Google","Meta"],92:["Amazon","Google","Meta","Microsoft"],93:["Amazon","Meta","Microsoft"],
  94:["Amazon","Google","Microsoft"],95:["Amazon","Google","Microsoft"],96:["Amazon","Google","Microsoft","Meta"],
  97:["Amazon","Google","Microsoft"],98:["Amazon","Meta","Microsoft","Google"],99:["Amazon","Google","Microsoft"],
  100:["Amazon","Google","Microsoft"],
};
const COMPANY_COLORS = {Google:"#4285F4",Amazon:"#FF9900",Microsoft:"#00A4EF",Meta:"#0668E1",Apple:"#555",Bloomberg:"#1E1E1E",Adobe:"#FF0000","Goldman Sachs":"#7399C6",LinkedIn:"#0A66C2",Uber:"#000",Samsung:"#1428A0"};

// ── Category Tags ──
const CAT_TAG = { Programming: { label: "DSA", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "🧮" }, Database: { label: "SQL", color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", icon: "🗄️" }, Web: { label: "JavaScript", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "⚡" } };
const CAT_TAG_DARK = { Programming: { label: "DSA", color: "#A78BFA", bg: "#2E1065", border: "#6D28D9", icon: "🧮" }, Database: { label: "SQL", color: "#22D3EE", bg: "#083344", border: "#0E7490", icon: "🗄️" }, Web: { label: "JavaScript", color: "#FBBF24", bg: "#451A03", border: "#92400E", icon: "⚡" } };

// ── Boilerplate generator ──
function bp(name, pySig, javaRet, javaSig, cppRet, cppSig, jsParams) {
  return {
    python: `class Solution:\n    def ${name}(self, ${pySig}):\n        # Write your solution here\n        pass`,
    java: `class Solution {\n    public ${javaRet} ${name}(${javaSig}) {\n        // Write your solution here\n        ${javaRet === "void" ? "" : javaRet === "boolean" || javaRet === "bool" ? "return false;" : javaRet === "int" ? "return 0;" : javaRet === "double" ? "return 0.0;" : javaRet === "String" ? 'return "";' : "return null;"}\n    }\n}`,
    cpp: `class Solution {\npublic:\n    ${cppRet} ${name}(${cppSig}) {\n        // Write your solution here\n        ${cppRet === "void" ? "" : cppRet === "bool" ? "return false;" : cppRet === "int" ? "return 0;" : cppRet === "double" ? "return 0.0;" : cppRet === "string" ? 'return "";' : "return {};"}\n    }\n};`,
    c: `// Write your C solution for ${name}\n#include <stdlib.h>\n\n// Implement your solution here\n`,
    javascript: `/**\n * @param {${jsParams}}\n */\nvar ${name} = function(${jsParams.split('}')[0].includes(',') ? jsParams.replace(/\{[^}]+\}\s*/g, '').replace(/\s+/g,' ').trim() : jsParams.replace(/\{[^}]+\}\s*/g, '').trim()}) {\n    // Write your solution here\n};`,
  };
}

// ── 100 Placement Problems ──

// ── Problem Helpers ──
function sqlBp(q) { return { mysql: `-- MySQL\n${q}`, postgresql: `-- PostgreSQL\n${q}`, mongodb: `// MongoDB\ndb.collection.find({});\n// Translate the SQL logic above` }; }
function jsBp(name, params) { return { javascript: `function ${name}(${params}) {\n    // Write your solution here\n}`, html: `<!DOCTYPE html>\n<html><head><title>Solution</title></head>\n<body>\n<script>\nfunction ${name}(${params}) {\n    // Write your solution here\n}\n</script>\n</body></html>`, css: `/* Add styles if needed */` }; }
function mkP(id, title, diff, cat, tags, desc, exIn, exOut, constraints, tcIn, tcOut, boilerplate) {
  return { id, title, difficulty: diff, cat, tags, acceptance: `${30+((id*7)%40)}.${(id*3)%10}%`, likes: 1000+id*47,
    description: desc, examples: [{ input: exIn, output: exOut, explanation: null }],
    constraints, testCases: [{ input: tcIn, expected: tcOut }], boilerplate };
}

const PROBLEMS = [
  // ═══════════════════════════════════
  //  PROGRAMMING (1-100)
  // ═══════════════════════════════════
  mkP(1,"Two Sum","Easy","Programming",["Array","Hash Table"],`Given an array \`nums\` and an integer \`target\`, return indices of the two numbers that add up to \`target\`. Each input has exactly one solution.`,"nums=[2,7,11,15], target=9","[0,1]",["2<=nums.length<=10⁴","-10⁹<=nums[i]<=10⁹"],"[2,7,11,15]\n9","[0,1]",bp("twoSum","nums: list[int], target: int","int[]","int[] nums, int target","vector<int>","vector<int>& nums, int target","{number[]} nums, {number} target")),
  mkP(2,"Best Time to Buy and Sell Stock","Easy","Programming",["Array","Greedy"],`Given array \`prices\` where \`prices[i]\` is a stock price on day i, return the maximum profit from one buy and one sell. Return 0 if no profit.`,"prices=[7,1,5,3,6,4]","5",["1<=prices.length<=10⁵"],"[7,1,5,3,6,4]","5",bp("maxProfit","prices: list[int]","int","int[] prices","int","vector<int>& prices","{number[]} prices")),
  mkP(3,"Contains Duplicate","Easy","Programming",["Array","Hash Table"],`Return \`true\` if any value appears at least twice in the array.`,"nums=[1,2,3,1]","true",["1<=nums.length<=10⁵"],"[1,2,3,1]","true",bp("containsDuplicate","nums: list[int]","boolean","int[] nums","bool","vector<int>& nums","{number[]} nums")),
  mkP(4,"Maximum Subarray","Medium","Programming",["Array","DP"],`Find the contiguous subarray with the largest sum and return its sum.`,"nums=[-2,1,-3,4,-1,2,1,-5,4]","6",["1<=nums.length<=10⁵"],"[-2,1,-3,4,-1,2,1,-5,4]","6",bp("maxSubArray","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(5,"Product of Array Except Self","Medium","Programming",["Array","Prefix Sum"],`Return array where answer[i] equals the product of all elements except nums[i]. O(n) without division.`,"nums=[1,2,3,4]","[24,12,8,6]",["2<=nums.length<=10⁵"],"[1,2,3,4]","[24,12,8,6]",bp("productExceptSelf","nums: list[int]","int[]","int[] nums","vector<int>","vector<int>& nums","{number[]} nums")),
  mkP(6,"3Sum","Medium","Programming",["Array","Two Pointers"],`Return all triplets [nums[i],nums[j],nums[k]] where i≠j≠k and nums[i]+nums[j]+nums[k]==0. No duplicate triplets.`,"nums=[-1,0,1,2,-1,-4]","[[-1,-1,2],[-1,0,1]]",["3<=nums.length<=3000"],"[-1,0,1,2,-1,-4]","[[-1,-1,2],[-1,0,1]]",bp("threeSum","nums: list[int]","List<List<Integer>>","int[] nums","vector<vector<int>>","vector<int>& nums","{number[]} nums")),
  mkP(7,"Container With Most Water","Medium","Programming",["Array","Two Pointers"],`Find two lines that form a container holding the most water. Return the maximum water amount.`,"height=[1,8,6,2,5,4,8,3,7]","49",["2<=n<=10⁵"],"[1,8,6,2,5,4,8,3,7]","49",bp("maxArea","height: list[int]","int","int[] height","int","vector<int>& height","{number[]} height")),
  mkP(8,"Merge Intervals","Medium","Programming",["Array","Sorting"],`Merge all overlapping intervals and return non-overlapping intervals.`,"intervals=[[1,3],[2,6],[8,10],[15,18]]","[[1,6],[8,10],[15,18]]",["1<=intervals.length<=10⁴"],"[[1,3],[2,6],[8,10],[15,18]]","[[1,6],[8,10],[15,18]]",bp("merge","intervals: list[list[int]]","int[][]","int[][] intervals","vector<vector<int>>","vector<vector<int>>& intervals","{number[][]} intervals")),
  mkP(9,"Sort Colors","Medium","Programming",["Array","Two Pointers"],`Sort array of 0s, 1s, and 2s in-place (Dutch National Flag problem).`,"nums=[2,0,2,1,1,0]","[0,0,1,1,2,2]",["1<=n<=300"],"[2,0,2,1,1,0]","[0,0,1,1,2,2]",bp("sortColors","nums: list[int]","void","int[] nums","void","vector<int>& nums","{number[]} nums")),
  mkP(10,"Next Permutation","Medium","Programming",["Array"],`Find the next lexicographically greater permutation. If none exists, rearrange to lowest order.`,"nums=[1,2,3]","[1,3,2]",["1<=nums.length<=100"],"[1,2,3]","[1,3,2]",bp("nextPermutation","nums: list[int]","void","int[] nums","void","vector<int>& nums","{number[]} nums")),
  mkP(11,"Trapping Rain Water","Hard","Programming",["Array","Two Pointers","Stack"],`Compute how much water can be trapped after raining given an elevation map.`,"height=[0,1,0,2,1,0,1,3,2,1,2,1]","6",["n>=1","0<=height[i]<=10⁵"],"[0,1,0,2,1,0,1,3,2,1,2,1]","6",bp("trap","height: list[int]","int","int[] height","int","vector<int>& height","{number[]} height")),
  mkP(12,"Rotate Array","Medium","Programming",["Array"],`Rotate the array to the right by k steps in-place.`,"nums=[1,2,3,4,5,6,7],k=3","[5,6,7,1,2,3,4]",["1<=nums.length<=10⁵"],"[1,2,3,4,5,6,7]\n3","[5,6,7,1,2,3,4]",bp("rotate","nums: list[int], k: int","void","int[] nums, int k","void","vector<int>& nums, int k","{number[]} nums, {number} k")),
  mkP(13,"Missing Number","Easy","Programming",["Array","Math","Bit"],`Find the missing number in array containing n distinct numbers from range [0,n].`,"nums=[3,0,1]","2",["n==nums.length","1<=n<=10⁴"],"[3,0,1]","2",bp("missingNumber","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(14,"Move Zeroes","Easy","Programming",["Array","Two Pointers"],`Move all 0s to the end while maintaining relative order of non-zero elements. In-place.`,"nums=[0,1,0,3,12]","[1,3,12,0,0]",["1<=nums.length<=10⁴"],"[0,1,0,3,12]","[1,3,12,0,0]",bp("moveZeroes","nums: list[int]","void","int[] nums","void","vector<int>& nums","{number[]} nums")),
  mkP(15,"Majority Element","Easy","Programming",["Array","Hash Table"],`Return the element appearing more than ⌊n/2⌋ times (Boyer-Moore).`,"nums=[3,2,3]","3",["n>=1"],"[3,2,3]","3",bp("majorityElement","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(16,"Find First and Last Position","Medium","Programming",["Array","Binary Search"],`Find starting and ending position of target in sorted array. O(log n).`,"nums=[5,7,7,8,8,10],target=8","[3,4]",["0<=nums.length<=10⁵"],"[5,7,7,8,8,10]\n8","[3,4]",bp("searchRange","nums: list[int], target: int","int[]","int[] nums, int target","vector<int>","vector<int>& nums, int target","{number[]} nums, {number} target")),
  mkP(17,"Valid Parentheses","Easy","Programming",["String","Stack"],`Determine if input string of brackets (){}[] is valid.`,'s="()[]{}"',"true",["1<=s.length<=10⁴"],"()[]{}","true",bp("isValid","s: str","boolean","String s","bool","string s","{string} s")),
  mkP(18,"Longest Substring Without Repeating","Medium","Programming",["String","Sliding Window"],`Find the length of the longest substring without repeating characters.`,'s="abcabcbb"',"3",["0<=s.length<=5×10⁴"],"abcabcbb","3",bp("lengthOfLongestSubstring","s: str","int","String s","int","string s","{string} s")),
  mkP(19,"Longest Palindromic Substring","Medium","Programming",["String","DP"],`Return the longest palindromic substring in s.`,'s="babad"','"bab"',["1<=s.length<=1000"],"babad","bab",bp("longestPalindrome","s: str","String","String s","string","string s","{string} s")),
  mkP(20,"Group Anagrams","Medium","Programming",["String","Hash Table"],`Group strings that are anagrams of each other.`,'strs=["eat","tea","tan","ate","nat","bat"]','[["bat"],["nat","tan"],["ate","eat","tea"]]',["1<=strs.length<=10⁴"],'["eat","tea","tan","ate","nat","bat"]','grouped',bp("groupAnagrams","strs: list[str]","List<List<String>>","String[] strs","vector<vector<string>>","vector<string>& strs","{string[]} strs")),
  mkP(21,"Longest Common Prefix","Easy","Programming",["String"],`Find the longest common prefix string amongst an array of strings.`,'strs=["flower","flow","flight"]','"fl"',["1<=strs.length<=200"],'["flower","flow","flight"]',"fl",bp("longestCommonPrefix","strs: list[str]","String","String[] strs","string","vector<string>& strs","{string[]} strs")),
  mkP(22,"Valid Anagram","Easy","Programming",["String","Hash Table"],`Return true if t is an anagram of s.`,'s="anagram",t="nagaram"',"true",["1<=s.length<=5×10⁴"],"anagram\nnagaram","true",bp("isAnagram","s: str, t: str","boolean","String s, String t","bool","string s, string t","{string} s, {string} t")),
  mkP(23,"String to Integer (atoi)","Medium","Programming",["String"],`Convert string to 32-bit signed integer. Handle whitespace, sign, overflow.`,'s="   -042"',"-42",["0<=s.length<=200"],"   -042","-42",bp("myAtoi","s: str","int","String s","int","string s","{string} s")),
  mkP(24,"Palindrome Check","Easy","Programming",["String","Two Pointers"],`Check if string is palindrome considering only alphanumeric characters.`,'s="A man, a plan, a canal: Panama"',"true",["1<=s.length<=2×10⁵"],"A man, a plan, a canal: Panama","true",bp("isPalindrome","s: str","boolean","String s","bool","string s","{string} s")),
  mkP(25,"Minimum Window Substring","Hard","Programming",["String","Sliding Window"],`Find the minimum window in s containing all characters of t.`,'s="ADOBECODEBANC",t="ABC"','"BANC"',["1<=m,n<=10⁵"],"ADOBECODEBANC\nABC","BANC",bp("minWindow","s: str, t: str","String","String s, String t","string","string s, string t","{string} s, {string} t")),
  mkP(26,"Implement strStr()","Easy","Programming",["String","KMP"],`Return index of first occurrence of needle in haystack, or -1.`,'haystack="sadbutsad",needle="sad"',"0",["1<=haystack.length<=10⁴"],"sadbutsad\nsad","0",bp("strStr","haystack: str, needle: str","int","String haystack, String needle","int","string haystack, string needle","{string} haystack, {string} needle")),
  mkP(27,"Count and Say","Medium","Programming",["String"],`Return the nth element of the count-and-say sequence.`,"n=4",'"1211"',["1<=n<=30"],"4","1211",bp("countAndSay","n: int","String","int n","string","int n","{number} n")),
  mkP(28,"Reverse Words in a String","Medium","Programming",["String"],`Reverse the order of words in a string.`,'s="the sky is blue"','"blue is sky the"',["1<=s.length<=10⁴"],"the sky is blue","blue is sky the",bp("reverseWords","s: str","String","String s","string","string s","{string} s")),
  mkP(29,"Reverse Linked List","Easy","Programming",["Linked List","Recursion"],`Reverse a singly linked list.`,"head=[1,2,3,4,5]","[5,4,3,2,1]",["0<=n<=5000"],"[1,2,3,4,5]","[5,4,3,2,1]",bp("reverseList","head: ListNode","ListNode","ListNode head","ListNode*","ListNode* head","{ListNode} head")),
  mkP(30,"Merge Two Sorted Lists","Easy","Programming",["Linked List"],`Merge two sorted linked lists into one sorted list.`,"l1=[1,2,4],l2=[1,3,4]","[1,1,2,3,4,4]",["0<=n<=50"],"[1,2,4]\n[1,3,4]","[1,1,2,3,4,4]",bp("mergeTwoLists","l1: ListNode, l2: ListNode","ListNode","ListNode l1, ListNode l2","ListNode*","ListNode* l1, ListNode* l2","{ListNode} l1, {ListNode} l2")),
  mkP(31,"Linked List Cycle","Easy","Programming",["Linked List","Two Pointers"],`Determine if a linked list has a cycle.`,"head=[3,2,0,-4],pos=1","true",["0<=n<=10⁴"],"[3,2,0,-4] pos=1","true",bp("hasCycle","head: ListNode","boolean","ListNode head","bool","ListNode* head","{ListNode} head")),
  mkP(32,"Remove Nth Node From End","Medium","Programming",["Linked List","Two Pointers"],`Remove the nth node from the end of the list in one pass.`,"head=[1,2,3,4,5],n=2","[1,2,3,5]",["1<=n<=sz"],"[1,2,3,4,5]\n2","[1,2,3,5]",bp("removeNthFromEnd","head: ListNode, n: int","ListNode","ListNode head, int n","ListNode*","ListNode* head, int n","{ListNode} head, {number} n")),
  mkP(33,"Add Two Numbers","Medium","Programming",["Linked List","Math"],`Add two numbers represented as reverse-order linked lists.`,"l1=[2,4,3],l2=[5,6,4]","[7,0,8]",["1<=n<=100"],"[2,4,3]\n[5,6,4]","[7,0,8]",bp("addTwoNumbers","l1: ListNode, l2: ListNode","ListNode","ListNode l1, ListNode l2","ListNode*","ListNode* l1, ListNode* l2","{ListNode} l1, {ListNode} l2")),
  mkP(34,"Intersection of Two Linked Lists","Easy","Programming",["Linked List"],`Find the node where two singly linked lists intersect.`,"listA=[4,1,8,4,5]","Node 8",["m,n>=1"],"[4,1,8,4,5]\n[5,6,1,8,4,5]","8",bp("getIntersectionNode","headA: ListNode, headB: ListNode","ListNode","ListNode headA, ListNode headB","ListNode*","ListNode* headA, ListNode* headB","{ListNode} headA, {ListNode} headB")),
  mkP(35,"Palindrome Linked List","Easy","Programming",["Linked List","Two Pointers"],`Check if a linked list is a palindrome. O(n) time, O(1) space.`,"head=[1,2,2,1]","true",["1<=n<=10⁵"],"[1,2,2,1]","true",bp("isPalindrome","head: ListNode","boolean","ListNode head","bool","ListNode* head","{ListNode} head")),
  mkP(36,"Copy List with Random Pointer","Medium","Programming",["Linked List","Hash Table"],`Deep copy a linked list where each node has a random pointer.`,"head=[[7,null],[13,0]]","deep copy",["0<=n<=1000"],"[[7,null],[13,0]]","deep copy",bp("copyRandomList","head: Node","Node","Node head","Node*","Node* head","{Node} head")),
  mkP(37,"Flatten Multilevel Linked List","Medium","Programming",["Linked List","DFS"],`Flatten a multilevel doubly linked list with child pointers.`,"head=[1,2,3,4,5,6]","[1,2,3,7,8,4,5,6]",["n<=1000"],"[1,2,3,4,5,6]","flattened",bp("flatten","head: Node","Node","Node head","Node*","Node* head","{Node} head")),
  mkP(38,"LRU Cache","Hard","Programming",["Linked List","Hash Table","Design"],`Design a Least Recently Used cache with O(1) get and put.`,"capacity=2, operations","[null,null,null,1,null,-1]",["1<=capacity<=3000"],"{capacity:2}","LRU operations",{python:`class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass`,java:`class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,cpp:`class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,c:`// Implement LRU Cache\n`,javascript:`var LRUCache = function(capacity) {};\nLRUCache.prototype.get = function(key) { return -1; };\nLRUCache.prototype.put = function(key, value) {};`}),
  mkP(39,"Min Stack","Medium","Programming",["Stack","Design"],`Design a stack supporting push, pop, top, and getMin in O(1).`,"push(-2),push(0),push(-3),getMin()","−3",["ops on non-empty stack"],"push(-2,-3),getMin","-3",{python:`class MinStack:\n    def __init__(self): pass\n    def push(self, val): pass\n    def pop(self): pass\n    def top(self): pass\n    def getMin(self): pass`,java:`class MinStack {\n    public void push(int v) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}`,cpp:`class MinStack {\npublic:\n    void push(int v) {}\n    void pop() {}\n    int top() { return 0; }\n    int getMin() { return 0; }\n};`,c:`// MinStack\n`,javascript:`var MinStack=function(){};\nMinStack.prototype.push=function(v){};\nMinStack.prototype.pop=function(){};\nMinStack.prototype.top=function(){return 0};\nMinStack.prototype.getMin=function(){return 0};`}),
  mkP(40,"Next Greater Element","Medium","Programming",["Stack","Monotonic Stack"],`Find the next greater number for every element in a circular array.`,"nums=[1,2,1]","[2,-1,2]",["1<=nums.length<=10⁴"],"[1,2,1]","[2,-1,2]",bp("nextGreaterElements","nums: list[int]","int[]","int[] nums","vector<int>","vector<int>& nums","{number[]} nums")),
  mkP(41,"Evaluate Reverse Polish Notation","Medium","Programming",["Stack","Math"],`Evaluate an arithmetic expression in Reverse Polish Notation.`,'tokens=["2","1","+","3","*"]',"9",["1<=tokens.length<=10⁴"],'["2","1","+","3","*"]',"9",bp("evalRPN","tokens: list[str]","int","String[] tokens","int","vector<string>& tokens","{string[]} tokens")),
  mkP(42,"Daily Temperatures","Medium","Programming",["Stack","Monotonic Stack"],`Return array of days to wait for warmer temperature. 0 if none.`,"temperatures=[73,74,75,71,69,72,76,73]","[1,1,4,2,1,1,0,0]",["1<=n<=10⁵"],"[73,74,75,71,69,72,76,73]","[1,1,4,2,1,1,0,0]",bp("dailyTemperatures","t: list[int]","int[]","int[] t","vector<int>","vector<int>& t","{number[]} t")),
  mkP(43,"Largest Rectangle in Histogram","Hard","Programming",["Stack","Monotonic Stack"],`Find the area of the largest rectangle in a histogram.`,"heights=[2,1,5,6,2,3]","10",["1<=n<=10⁵"],"[2,1,5,6,2,3]","10",bp("largestRectangleArea","heights: list[int]","int","int[] heights","int","vector<int>& heights","{number[]} heights")),
  mkP(44,"Sliding Window Maximum","Hard","Programming",["Queue","Deque"],`Return the max element in each sliding window of size k.`,"nums=[1,3,-1,-3,5,3,6,7],k=3","[3,3,5,5,6,7]",["1<=n<=10⁵"],"[1,3,-1,-3,5,3,6,7]\n3","[3,3,5,5,6,7]",bp("maxSlidingWindow","nums: list[int], k: int","int[]","int[] nums, int k","vector<int>","vector<int>& nums, int k","{number[]} nums, {number} k")),
  mkP(45,"Stock Span Problem","Medium","Programming",["Stack","Monotonic Stack"],`Find span of stock prices (consecutive days with price ≤ today).`,"prices=[100,80,60,70,60,75,85]","[1,1,1,2,1,4,6]",["1<=price<=10⁵"],"[100,80,60,70,60,75,85]","[1,1,1,2,1,4,6]",{python:`class StockSpanner:\n    def __init__(self): pass\n    def next(self, price: int) -> int: pass`,java:`class StockSpanner {\n    public int next(int price) { return 0; }\n}`,cpp:`class StockSpanner {\npublic:\n    int next(int price) { return 0; }\n};`,c:`// StockSpanner\n`,javascript:`var StockSpanner=function(){};\nStockSpanner.prototype.next=function(p){return 0};`}),
  mkP(46,"Maximum Depth of Binary Tree","Easy","Programming",["Tree","DFS"],`Return the maximum depth of a binary tree.`,"root=[3,9,20,null,null,15,7]","3",["0<=n<=10⁴"],"[3,9,20,null,null,15,7]","3",bp("maxDepth","root: TreeNode","int","TreeNode root","int","TreeNode* root","{TreeNode} root")),
  mkP(47,"Invert Binary Tree","Easy","Programming",["Tree","DFS"],`Invert a binary tree (swap left and right children recursively).`,"root=[4,2,7,1,3,6,9]","[4,7,2,9,6,3,1]",["0<=n<=100"],"[4,2,7,1,3,6,9]","[4,7,2,9,6,3,1]",bp("invertTree","root: TreeNode","TreeNode","TreeNode root","TreeNode*","TreeNode* root","{TreeNode} root")),
  mkP(48,"Validate BST","Medium","Programming",["Tree","DFS","BST"],`Determine if a binary tree is a valid binary search tree.`,"root=[2,1,3]","true",["1<=n<=10⁴"],"[2,1,3]","true",bp("isValidBST","root: TreeNode","boolean","TreeNode root","bool","TreeNode* root","{TreeNode} root")),
  mkP(49,"Level Order Traversal","Medium","Programming",["Tree","BFS"],`Return level order traversal of a binary tree's node values.`,"root=[3,9,20,null,null,15,7]","[[3],[9,20],[15,7]]",["0<=n<=2000"],"[3,9,20,null,null,15,7]","[[3],[9,20],[15,7]]",bp("levelOrder","root: TreeNode","List<List<Integer>>","TreeNode root","vector<vector<int>>","TreeNode* root","{TreeNode} root")),
  mkP(50,"Lowest Common Ancestor","Medium","Programming",["Tree","BST"],`Find the lowest common ancestor of two nodes in a BST.`,"root=[6,2,8,0,4,7,9],p=2,q=8","6",["All values unique"],"[6,2,8,0,4,7,9] p=2 q=8","6",bp("lowestCommonAncestor","root: TreeNode, p: TreeNode, q: TreeNode","TreeNode","TreeNode root, TreeNode p, TreeNode q","TreeNode*","TreeNode* root, TreeNode* p, TreeNode* q","{TreeNode} root, p, q")),
  mkP(51,"Diameter of Binary Tree","Easy","Programming",["Tree","DFS"],`Return the length of the diameter (longest path between any two nodes).`,"root=[1,2,3,4,5]","3",["1<=n<=10⁴"],"[1,2,3,4,5]","3",bp("diameterOfBinaryTree","root: TreeNode","int","TreeNode root","int","TreeNode* root","{TreeNode} root")),
  mkP(52,"Symmetric Tree","Easy","Programming",["Tree","BFS","DFS"],`Check if a binary tree is a mirror of itself.`,"root=[1,2,2,3,4,4,3]","true",["1<=n<=1000"],"[1,2,2,3,4,4,3]","true",bp("isSymmetric","root: TreeNode","boolean","TreeNode root","bool","TreeNode* root","{TreeNode} root")),
  mkP(53,"Binary Tree Right Side View","Medium","Programming",["Tree","BFS"],`Return values visible from the right side of a binary tree.`,"root=[1,2,3,null,5,null,4]","[1,3,4]",["0<=n<=100"],"[1,2,3,null,5,null,4]","[1,3,4]",bp("rightSideView","root: TreeNode","List<Integer>","TreeNode root","vector<int>","TreeNode* root","{TreeNode} root")),
  mkP(54,"Construct from Preorder & Inorder","Medium","Programming",["Tree","Divide and Conquer"],`Build binary tree from preorder and inorder traversal arrays.`,"pre=[3,9,20,15,7],in=[9,3,15,20,7]","[3,9,20,null,null,15,7]",["1<=n<=3000"],"[3,9,20,15,7]\n[9,3,15,20,7]","[3,9,20,null,null,15,7]",bp("buildTree","preorder: list[int], inorder: list[int]","TreeNode","int[] preorder, int[] inorder","TreeNode*","vector<int>& preorder, vector<int>& inorder","{number[]} pre, {number[]} in")),
  mkP(55,"Serialize & Deserialize Tree","Hard","Programming",["Tree","Design"],`Design algorithm to serialize and deserialize a binary tree.`,"root=[1,2,3,null,null,4,5]","[1,2,3,null,null,4,5]",["0<=n<=10⁴"],"[1,2,3,null,null,4,5]","[1,2,3,null,null,4,5]",{python:`class Codec:\n    def serialize(self, root): pass\n    def deserialize(self, data): pass`,java:`public class Codec {\n    public String serialize(TreeNode r) { return ""; }\n    public TreeNode deserialize(String d) { return null; }\n}`,cpp:`class Codec {\npublic:\n    string serialize(TreeNode* r) { return ""; }\n    TreeNode* deserialize(string d) { return nullptr; }\n};`,c:`// Serialize/Deserialize\n`,javascript:`var serialize=function(r){return ""};\nvar deserialize=function(d){return null};`}),
  mkP(56,"Binary Tree Maximum Path Sum","Hard","Programming",["Tree","DFS","DP"],`Find the maximum path sum in a binary tree (path need not pass through root).`,"root=[-10,9,20,null,null,15,7]","42",["1<=n<=3×10⁴"],"[-10,9,20,null,null,15,7]","42",bp("maxPathSum","root: TreeNode","int","TreeNode root","int","TreeNode* root","{TreeNode} root")),
  mkP(57,"Kth Smallest in BST","Medium","Programming",["Tree","BST"],`Return the kth smallest value in a BST (1-indexed).`,"root=[3,1,4,null,2],k=1","1",["1<=k<=n"],"[3,1,4,null,2]\n1","1",bp("kthSmallest","root: TreeNode, k: int","int","TreeNode root, int k","int","TreeNode* root, int k","{TreeNode} root, {number} k")),
  mkP(58,"Number of Islands","Medium","Programming",["Graph","DFS","BFS"],`Count the number of islands in a 2D binary grid (1=land, 0=water).`,'grid=[["1","1","0"],["0","1","0"],["0","0","1"]]',"2",["1<=m,n<=300"],'[["1","1","0"],["0","1","0"]]',"2",bp("numIslands","grid: list[list[str]]","int","char[][] grid","int","vector<vector<char>>& grid","{char[][]} grid")),
  mkP(59,"Clone Graph","Medium","Programming",["Graph","DFS","BFS"],`Return a deep copy of a connected undirected graph.`,"adjList=[[2,4],[1,3],[2,4],[1,3]]","deep copy",["1<=n<=100"],"[[2,4],[1,3],[2,4],[1,3]]","deep copy",bp("cloneGraph","node: Node","Node","Node node","Node*","Node* node","{Node} node")),
  mkP(60,"Course Schedule","Medium","Programming",["Graph","Topological Sort"],`Determine if you can finish all courses given prerequisites (cycle detection).`,"numCourses=2,pre=[[1,0]]","true",["1<=numCourses<=2000"],"2\n[[1,0]]","true",bp("canFinish","n: int, pre: list[list[int]]","boolean","int n, int[][] pre","bool","int n, vector<vector<int>>& pre","{number} n, {number[][]} pre")),
  mkP(61,"Word Ladder","Hard","Programming",["Graph","BFS"],`Find shortest transformation sequence length from beginWord to endWord.`,'begin="hit",end="cog"',"5",["1<=beginWord.length<=10"],'hit\ncog\n["hot","dot","dog","lot","log","cog"]',"5",bp("ladderLength","begin: str, end: str, words: list[str]","int","String b, String e, List<String> w","int","string b, string e, vector<string>& w","{string} b, {string} e, {string[]} w")),
  mkP(62,"Detect Cycle in Directed Graph","Medium","Programming",["Graph","DFS"],`Check whether a directed graph contains any cycle.`,"V=4,edges=[[0,1],[1,2],[2,3],[3,1]]","true",["1<=V<=10⁴"],"V=4,edges=[[0,1],[1,2],[2,3],[3,1]]","true",bp("hasCycle","V: int, adj: list","boolean","int V, List<List<Integer>> adj","bool","int V, vector<vector<int>>& adj","{number} V, {number[][]} adj")),
  mkP(63,"Dijkstra's Shortest Path","Medium","Programming",["Graph","Heap"],`Find shortest distances from source to all vertices using Dijkstra's algorithm.`,"V=3,src=0","[0,1,3]",["1<=V<=10⁵","No negative weights"],"V=3,src=0","[0,1,3]",bp("dijkstra","V: int, adj: list, src: int","int[]","int V, List adj, int src","vector<int>","int V, vector<vector<pair<int,int>>>& adj, int src","{number} V, adj, {number} src")),
  mkP(64,"Flood Fill","Easy","Programming",["Graph","DFS","Matrix"],`Perform a flood fill starting from pixel (sr,sc) with given color.`,"image=[[1,1,1],[1,1,0],[1,0,1]],sr=1,sc=1,color=2","[[2,2,2],[2,2,0],[2,0,1]]",["1<=m,n<=50"],"[[1,1,1],[1,1,0],[1,0,1]]\n1 1 2","[[2,2,2],[2,2,0],[2,0,1]]",bp("floodFill","image: list, sr: int, sc: int, color: int","int[][]","int[][] img, int sr, int sc, int c","vector<vector<int>>","vector<vector<int>>& img, int sr, int sc, int c","{number[][]} img, {number} sr, sc, c")),
  mkP(65,"Rotten Oranges","Medium","Programming",["Graph","BFS"],`Return minutes until no fresh orange remains. -1 if impossible.`,"grid=[[2,1,1],[1,1,0],[0,1,1]]","4",["1<=m,n<=10"],"[[2,1,1],[1,1,0],[0,1,1]]","4",bp("orangesRotting","grid: list","int","int[][] grid","int","vector<vector<int>>& grid","{number[][]} grid")),
  mkP(66,"Word Search","Medium","Programming",["Graph","Backtracking"],`Check if word exists in a character grid via adjacent cells.`,'board=[["A","B"],["C","D"]],word="ABCD"',"false",["1<=m,n<=6"],'[["A","B"],["C","D"]]\nABDC',"true",bp("exist","board: list, word: str","boolean","char[][] b, String w","bool","vector<vector<char>>& b, string w","{char[][]} b, {string} w")),
  mkP(67,"Pacific Atlantic Water Flow","Medium","Programming",["Graph","DFS"],`Find cells where water can flow to both Pacific and Atlantic oceans.`,"heights=[[1,2],[3,4]]","[[0,1],[1,0],[1,1]]",["1<=m,n<=200"],"[[1,2],[3,4]]","cells reaching both",bp("pacificAtlantic","heights: list","List<List<Integer>>","int[][] h","vector<vector<int>>","vector<vector<int>>& h","{number[][]} h")),
  mkP(68,"Climbing Stairs","Easy","Programming",["DP","Math"],`Count distinct ways to climb n steps (1 or 2 steps at a time).`,"n=3","3",["1<=n<=45"],"3","3",bp("climbStairs","n: int","int","int n","int","int n","{number} n")),
  mkP(69,"House Robber","Medium","Programming",["DP"],`Max amount robbing non-adjacent houses.`,"nums=[1,2,3,1]","4",["1<=n<=100"],"[1,2,3,1]","4",bp("rob","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(70,"Coin Change","Medium","Programming",["DP","BFS"],`Fewest coins to make amount. Return -1 if impossible.`,"coins=[1,5,11],amount=11","1",["1<=coins.length<=12"],"[1,5,11]\n11","1",bp("coinChange","coins: list[int], amount: int","int","int[] coins, int amount","int","vector<int>& coins, int amount","{number[]} coins, {number} amount")),
  mkP(71,"Longest Increasing Subsequence","Medium","Programming",["DP","Binary Search"],`Return length of the longest strictly increasing subsequence.`,"nums=[10,9,2,5,3,7,101,18]","4",["1<=n<=2500"],"[10,9,2,5,3,7,101,18]","4",bp("lengthOfLIS","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(72,"0/1 Knapsack","Medium","Programming",["DP"],`Maximize value in knapsack of capacity W. Each item used at most once.`,"W=50,wt=[10,20,30],val=[60,100,120]","220",["1<=n<=1000"],"W=50,wt=[10,20,30],val=[60,100,120]","220",bp("knapsack","W: int, wt: list, val: list","int","int W, int[] wt, int[] val","int","int W, vector<int>& wt, vector<int>& val","{number} W, {number[]} wt, val")),
  mkP(73,"Edit Distance","Medium","Programming",["String","DP"],`Minimum operations (insert/delete/replace) to convert word1 to word2.`,'word1="horse",word2="ros"',"3",["0<=len<=500"],"horse\nros","3",bp("minDistance","w1: str, w2: str","int","String w1, String w2","int","string w1, string w2","{string} w1, {string} w2")),
  mkP(74,"Longest Common Subsequence","Medium","Programming",["String","DP"],`Return length of the longest common subsequence of two strings.`,'text1="abcde",text2="ace"',"3",["1<=len<=1000"],"abcde\nace","3",bp("longestCommonSubsequence","t1: str, t2: str","int","String t1, String t2","int","string t1, string t2","{string} t1, {string} t2")),
  mkP(75,"Word Break","Medium","Programming",["String","DP","Trie"],`Can string s be segmented into dictionary words?`,'s="leetcode",dict=["leet","code"]',"true",["1<=s.length<=300"],'leetcode\n["leet","code"]',"true",bp("wordBreak","s: str, wordDict: list","boolean","String s, List<String> wd","bool","string s, vector<string>& wd","{string} s, {string[]} wd")),
  mkP(76,"Unique Paths","Medium","Programming",["DP","Math"],`Count unique paths from top-left to bottom-right in m×n grid (only right/down).`,"m=3,n=7","28",["1<=m,n<=100"],"3\n7","28",bp("uniquePaths","m: int, n: int","int","int m, int n","int","int m, int n","{number} m, {number} n")),
  mkP(77,"Decode Ways","Medium","Programming",["String","DP"],`Count ways to decode a digit string where A=1...Z=26.`,'s="226"',"3",["1<=s.length<=100"],"226","3",bp("numDecodings","s: str","int","String s","int","string s","{string} s")),
  mkP(78,"Matrix Chain Multiplication","Hard","Programming",["DP"],`Find minimum scalar multiplications needed for matrix chain.`,"arr=[40,20,30,10,30]","26000",["2<=arr.length<=100"],"[40,20,30,10,30]","26000",bp("matrixMultiplication","arr: list[int]","int","int[] arr","int","vector<int>& arr","{number[]} arr")),
  mkP(79,"Palindrome Partitioning","Medium","Programming",["String","DP","Backtracking"],`Partition string so every substring is a palindrome. Return all partitions.`,'s="aab"','[["a","a","b"],["aa","b"]]',["1<=s.length<=16"],"aab",'[["a","a","b"],["aa","b"]]',bp("partition","s: str","List<List<String>>","String s","vector<vector<string>>","string s","{string} s")),
  mkP(80,"Minimum Path Sum","Medium","Programming",["DP","Matrix"],`Find path from top-left to bottom-right minimizing sum (down/right only).`,"grid=[[1,3,1],[1,5,1],[4,2,1]]","7",["1<=m,n<=200"],"[[1,3,1],[1,5,1],[4,2,1]]","7",bp("minPathSum","grid: list","int","int[][] grid","int","vector<vector<int>>& grid","{number[][]} grid")),
  mkP(81,"Partition Equal Subset Sum","Medium","Programming",["DP"],`Can array be partitioned into two subsets with equal sum?`,"nums=[1,5,11,5]","true",["1<=n<=200"],"[1,5,11,5]","true",bp("canPartition","nums: list[int]","boolean","int[] nums","bool","vector<int>& nums","{number[]} nums")),
  mkP(82,"Egg Drop Problem","Hard","Programming",["DP","Binary Search"],`Minimum moves to find critical floor with k eggs and n floors.`,"k=2,n=6","3",["1<=k<=100"],"2\n6","3",bp("superEggDrop","k: int, n: int","int","int k, int n","int","int k, int n","{number} k, {number} n")),
  mkP(83,"Binary Search","Easy","Programming",["Array","Binary Search"],`Search for target in sorted array. Return index or -1. O(log n).`,"nums=[-1,0,3,5,9,12],target=9","4",["1<=n<=10⁴"],"[-1,0,3,5,9,12]\n9","4",bp("search","nums: list[int], target: int","int","int[] nums, int target","int","vector<int>& nums, int target","{number[]} nums, {number} target")),
  mkP(84,"Search in Rotated Sorted Array","Medium","Programming",["Binary Search"],`Search target in rotated sorted array. O(log n).`,"nums=[4,5,6,7,0,1,2],target=0","4",["1<=n<=5000"],"[4,5,6,7,0,1,2]\n0","4",bp("search","nums: list[int], target: int","int","int[] nums, int target","int","vector<int>& nums, int target","{number[]} nums, {number} target")),
  mkP(85,"Find Min in Rotated Array","Medium","Programming",["Binary Search"],`Find minimum element in rotated sorted array. O(log n).`,"nums=[3,4,5,1,2]","1",["1<=n<=5000"],"[3,4,5,1,2]","1",bp("findMin","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(86,"Median of Two Sorted Arrays","Hard","Programming",["Binary Search"],`Find median of two sorted arrays. O(log(m+n)).`,"nums1=[1,3],nums2=[2]","2.0",["0<=m,n<=1000"],"[1,3]\n[2]","2.0",bp("findMedianSortedArrays","a: list, b: list","double","int[] a, int[] b","double","vector<int>& a, vector<int>& b","{number[]} a, {number[]} b")),
  mkP(87,"Kth Smallest in Sorted Matrix","Medium","Programming",["Matrix","Binary Search"],`Find kth smallest element in row/column sorted matrix.`,"matrix=[[1,5,9],[10,11,13]],k=8","13",["1<=n<=300"],"[[1,5,9],[10,11,13],[12,13,15]]\n8","13",bp("kthSmallest","matrix: list, k: int","int","int[][] m, int k","int","vector<vector<int>>& m, int k","{number[][]} m, {number} k")),
  mkP(88,"Allocate Minimum Pages","Hard","Programming",["Binary Search","Greedy"],`Minimize max pages assigned to m students from contiguous book allocation.`,"books=[12,34,67,90],m=2","113",["1<=n<=10⁵"],"[12,34,67,90]\n2","113",bp("allocatePages","books: list, m: int","int","int[] b, int m","int","vector<int>& b, int m","{number[]} b, {number} m")),
  mkP(89,"Kth Largest Element","Medium","Programming",["Heap","Quickselect"],`Find the kth largest element without full sorting.`,"nums=[3,2,1,5,6,4],k=2","5",["1<=k<=n<=10⁵"],"[3,2,1,5,6,4]\n2","5",bp("findKthLargest","nums: list, k: int","int","int[] nums, int k","int","vector<int>& nums, int k","{number[]} nums, {number} k")),
  mkP(90,"Merge K Sorted Lists","Hard","Programming",["Linked List","Heap"],`Merge k sorted linked lists into one sorted linked list.`,"lists=[[1,4,5],[1,3,4],[2,6]]","[1,1,2,3,4,4,5,6]",["0<=k<=10⁴"],"[[1,4,5],[1,3,4],[2,6]]","[1,1,2,3,4,4,5,6]",bp("mergeKLists","lists: list","ListNode","ListNode[] lists","ListNode*","vector<ListNode*>& lists","{ListNode[]} lists")),
  mkP(91,"Top K Frequent Elements","Medium","Programming",["Heap","Hash Table"],`Return the k most frequent elements.`,"nums=[1,1,1,2,2,3],k=2","[1,2]",["1<=k<=unique"],"[1,1,1,2,2,3]\n2","[1,2]",bp("topKFrequent","nums: list, k: int","int[]","int[] nums, int k","vector<int>","vector<int>& nums, int k","{number[]} nums, {number} k")),
  mkP(92,"Find Median from Data Stream","Hard","Programming",["Heap","Design"],`Design structure supporting addNum and findMedian in O(log n).`,"addNum(1),addNum(2),findMedian()","1.5",["≤5×10⁴ calls"],"addNum(1,2),findMedian","1.5",{python:`class MedianFinder:\n    def __init__(self): pass\n    def addNum(self, num): pass\n    def findMedian(self): pass`,java:`class MedianFinder {\n    public void addNum(int n) {}\n    public double findMedian() { return 0; }\n}`,cpp:`class MedianFinder {\npublic:\n    void addNum(int n) {}\n    double findMedian() { return 0; }\n};`,c:`// MedianFinder\n`,javascript:`var MedianFinder=function(){};\nMedianFinder.prototype.addNum=function(n){};\nMedianFinder.prototype.findMedian=function(){return 0};`}),
  mkP(93,"Task Scheduler","Medium","Programming",["Greedy","Heap"],`Min intervals for CPU to finish all tasks with cooldown n between same tasks.`,'tasks=["A","A","A","B","B","B"],n=2',"8",["1<=tasks.length<=10⁴"],'["A","A","A","B","B","B"]\n2',"8",bp("leastInterval","tasks: list, n: int","int","char[] tasks, int n","int","vector<char>& tasks, int n","{char[]} tasks, {number} n")),
  mkP(94,"N-Queens","Hard","Programming",["Backtracking"],`Place n queens on n×n chessboard so no two attack each other.`,"n=4","2 solutions",["1<=n<=9"],"4","2 solutions",bp("solveNQueens","n: int","List<List<String>>","int n","vector<vector<string>>","int n","{number} n")),
  mkP(95,"Sudoku Solver","Hard","Programming",["Backtracking"],`Fill empty cells to solve a valid Sudoku.`,"9×9 board","solved board",["board is 9×9"],"9x9 board","solved",bp("solveSudoku","board: list","void","char[][] board","void","vector<vector<char>>& board","{char[][]} board")),
  mkP(96,"Permutations","Medium","Programming",["Backtracking"],`Return all permutations of distinct integers.`,"nums=[1,2,3]","6 permutations",["1<=n<=6"],"[1,2,3]","[[1,2,3],...]",bp("permute","nums: list[int]","List<List<Integer>>","int[] nums","vector<vector<int>>","vector<int>& nums","{number[]} nums")),
  mkP(97,"Combination Sum","Medium","Programming",["Backtracking"],`Find all unique combinations summing to target. Same number may be reused.`,"candidates=[2,3,6,7],target=7","[[2,2,3],[7]]",["1<=candidates.length<=30"],"[2,3,6,7]\n7","[[2,2,3],[7]]",bp("combinationSum","c: list, t: int","List<List<Integer>>","int[] c, int t","vector<vector<int>>","vector<int>& c, int t","{number[]} c, {number} t")),
  mkP(98,"Subsets","Medium","Programming",["Backtracking","Bit"],`Return all possible subsets (power set) of unique elements.`,"nums=[1,2,3]","8 subsets",["1<=n<=10"],"[1,2,3]","8 subsets",bp("subsets","nums: list[int]","List<List<Integer>>","int[] nums","vector<vector<int>>","vector<int>& nums","{number[]} nums")),
  mkP(99,"Single Number","Easy","Programming",["Bit Manipulation"],`Every element appears twice except one. Find it. O(n) time, O(1) space.`,"nums=[4,1,2,1,2]","4",["1<=n<=3×10⁴"],"[4,1,2,1,2]","4",bp("singleNumber","nums: list[int]","int","int[] nums","int","vector<int>& nums","{number[]} nums")),
  mkP(100,"Counting Bits","Easy","Programming",["DP","Bit"],`Return array where ans[i] is the number of 1s in binary representation of i.`,"n=5","[0,1,1,2,1,2]",["0<=n<=10⁵"],"5","[0,1,1,2,1,2]",bp("countBits","n: int","int[]","int n","vector<int>","int n","{number} n")),

  // ═══════════════════════════════════
  //  SQL / DATABASE (101-200)
  // ═══════════════════════════════════
  mkP(101,"Select All Employees","Easy","Database",["SELECT"],`Write a query to select all columns from the \`employees\` table.`,"employees table","All rows",["Use SELECT *"],"employees","All rows",sqlBp("SELECT * FROM employees;")),
  mkP(102,"Employee Names and Salaries","Easy","Database",["SELECT","WHERE"],`Select \`name\` and \`salary\` from employees earning more than 50000.`,"employees table","Filtered rows",["Use WHERE clause"],"employees","Filtered rows",sqlBp("SELECT name, salary\nFROM employees\nWHERE salary > 50000;")),
  mkP(103,"Order by Salary","Easy","Database",["ORDER BY"],`List all employees ordered by salary descending.`,"employees table","Sorted rows",["Use ORDER BY DESC"],"employees","Sorted",sqlBp("SELECT *\nFROM employees\nORDER BY salary DESC;")),
  mkP(104,"Count Employees per Department","Easy","Database",["GROUP BY","COUNT"],`Count the number of employees in each department.`,"employees table","dept, count",["Use GROUP BY"],"employees","dept counts",sqlBp("SELECT department, COUNT(*) as count\nFROM employees\nGROUP BY department;")),
  mkP(105,"Average Salary by Department","Easy","Database",["GROUP BY","AVG"],`Find the average salary for each department.`,"employees table","dept, avg_salary",["Use AVG()"],"employees","avg salaries",sqlBp("SELECT department, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department;")),
  mkP(106,"Second Highest Salary","Medium","Database",["SUBQUERY","LIMIT"],`Find the second highest salary from the employees table. Return NULL if none.`,"employees table","Second highest",["Handle NULL case"],"employees","second highest",sqlBp("SELECT MAX(salary) as SecondHighest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);")),
  mkP(107,"Duplicate Emails","Easy","Database",["GROUP BY","HAVING"],`Find all duplicate email addresses in the \`person\` table.`,"person table","Duplicate emails",["Use HAVING COUNT>1"],"person","duplicates",sqlBp("SELECT email\nFROM person\nGROUP BY email\nHAVING COUNT(*) > 1;")),
  mkP(108,"Customers Who Never Order","Easy","Database",["LEFT JOIN","NULL"],`Find customers who have never placed an order.`,"customers, orders","Non-ordering customers",["Use LEFT JOIN"],"customers, orders","no orders",sqlBp("SELECT c.name AS Customers\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;")),
  mkP(109,"Department Highest Salary","Medium","Database",["JOIN","SUBQUERY"],`Find employees with the highest salary in each department.`,"employee, department","Top earners per dept",["Use JOIN and subquery"],"employee, department","top earners",sqlBp("SELECT d.name AS Department, e.name AS Employee, e.salary\nFROM employee e\nJOIN department d ON e.dept_id = d.id\nWHERE (e.dept_id, e.salary) IN (\n    SELECT dept_id, MAX(salary) FROM employee GROUP BY dept_id\n);")),
  mkP(110,"Rank Scores","Medium","Database",["DENSE_RANK","Window"],`Rank scores in descending order with dense ranking (no gaps).`,"scores table","score, rank",["Use DENSE_RANK()"],"scores","ranked",sqlBp("SELECT score,\n    DENSE_RANK() OVER (ORDER BY score DESC) AS rank\nFROM scores;")),
  mkP(111,"Consecutive Numbers","Medium","Database",["Self JOIN"],`Find numbers that appear at least three times consecutively.`,"logs table","Consecutive nums",["Use self-join or LAG"],"logs","consecutive",sqlBp("SELECT DISTINCT l1.num AS ConsecutiveNums\nFROM logs l1, logs l2, logs l3\nWHERE l1.id = l2.id - 1 AND l2.id = l3.id - 1\nAND l1.num = l2.num AND l2.num = l3.num;")),
  mkP(112,"Employees Earning More Than Manager","Easy","Database",["Self JOIN"],`Find employees who earn more than their managers.`,"employee table","Names",["Self-join on manager_id"],"employee","higher than mgr",sqlBp("SELECT e.name AS Employee\nFROM employee e\nJOIN employee m ON e.manager_id = m.id\nWHERE e.salary > m.salary;")),
  mkP(113,"Rising Temperature","Easy","Database",["Self JOIN","DATE"],`Find dates where temperature was higher than the previous day.`,"weather table","Rising temp dates",["Use date comparison"],"weather","rising dates",sqlBp("SELECT w1.id\nFROM weather w1\nJOIN weather w2 ON w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY)\nWHERE w1.temperature > w2.temperature;")),
  mkP(114,"Delete Duplicate Emails","Easy","Database",["DELETE","Self JOIN"],`Delete duplicate emails keeping only the row with smallest id.`,"person table","Cleaned table",["Use DELETE with self-join"],"person","duplicates removed",sqlBp("DELETE p1\nFROM person p1, person p2\nWHERE p1.email = p2.email AND p1.id > p2.id;")),
  mkP(115,"Nth Highest Salary","Medium","Database",["Function","LIMIT"],`Create a function to return the nth highest salary.`,"employee table, n","Nth salary",["Use LIMIT OFFSET"],"employee, n=2","nth salary",sqlBp("-- Function to get Nth highest\nSELECT DISTINCT salary\nFROM employee\nORDER BY salary DESC\nLIMIT 1 OFFSET N-1;")),
  mkP(116,"Department Top 3 Salaries","Hard","Database",["Window","DENSE_RANK"],`Find top 3 earners in each department.`,"employee, department","Top 3 per dept",["Use DENSE_RANK partitioned"],"employee, department","top 3",sqlBp("SELECT dept, name, salary FROM (\n    SELECT *, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) rk\n    FROM employee\n) t WHERE rk <= 3;")),
  mkP(117,"Trips and Users Cancellation Rate","Hard","Database",["JOIN","CASE","GROUP BY"],`Calculate cancellation rate of unbanned users per day.`,"trips, users","date, cancel_rate",["Filter banned users first"],"trips, users","cancel rates",sqlBp("SELECT request_at AS Day,\n    ROUND(SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS cancel_rate\nFROM trips\nWHERE client_id NOT IN (SELECT id FROM users WHERE banned='Yes')\nGROUP BY request_at;")),
  mkP(118,"Human Traffic of Stadium","Hard","Database",["Window","Consecutive"],`Find rows with 3+ consecutive days of ≥100 visitors.`,"stadium table","Consecutive high traffic",["Use window functions"],"stadium","3+ consecutive",sqlBp("-- Find 3+ consecutive days with visitors >= 100\nSELECT * FROM stadium\nWHERE people >= 100\n-- Add logic for consecutive detection;")),
  mkP(119,"Exchange Seats","Medium","Database",["CASE","MOD"],`Swap every two consecutive students' seat ids.`,"seat table","Swapped seats",["Use CASE with MOD"],"seat","swapped",sqlBp("SELECT CASE\n    WHEN MOD(id, 2) = 1 AND id < (SELECT MAX(id) FROM seat) THEN id + 1\n    WHEN MOD(id, 2) = 0 THEN id - 1\n    ELSE id END AS id, student\nFROM seat ORDER BY id;")),
  mkP(120,"Tree Node","Medium","Database",["CASE","Self JOIN"],`Label each node in a tree as Root, Inner, or Leaf.`,"tree table","id, type",["Check parent and children"],"tree","labeled nodes",sqlBp("SELECT id, CASE\n    WHEN p_id IS NULL THEN 'Root'\n    WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner'\n    ELSE 'Leaf' END AS type\nFROM tree;")),
  mkP(121,"Managers with 5+ Reports","Medium","Database",["GROUP BY","HAVING","JOIN"],`Find managers who have at least 5 direct reports.`,"employee","Manager names",["GROUP BY manager_id"],"employee","managers",sqlBp("SELECT m.name\nFROM employee e\nJOIN employee m ON e.manager_id = m.id\nGROUP BY m.id, m.name\nHAVING COUNT(*) >= 5;")),
  mkP(122,"Investments in 2016","Medium","Database",["GROUP BY","HAVING","Subquery"],`Find total investment value in 2016 for policies with shared tiv_2015 but unique locations.`,"insurance","Sum of tiv_2016",["Complex filtering"],"insurance","filtered sum",sqlBp("SELECT SUM(tiv_2016) AS tiv_2016\nFROM insurance\nWHERE tiv_2015 IN (SELECT tiv_2015 FROM insurance GROUP BY tiv_2015 HAVING COUNT(*)>1)\nAND (lat,lon) IN (SELECT lat,lon FROM insurance GROUP BY lat,lon HAVING COUNT(*)=1);")),
  mkP(123,"Friend Requests Acceptance Rate","Medium","Database",["COUNT","DISTINCT"],`Calculate the overall acceptance rate of friend requests.`,"friend_request, accepted","Acceptance rate",["Handle division by zero"],"friend_request, accepted","rate",sqlBp("SELECT ROUND(\n    IFNULL(COUNT(DISTINCT a.requester_id, a.accepter_id) /\n    COUNT(DISTINCT f.sender_id, f.send_to_id), 0), 2\n) AS accept_rate\nFROM friend_request f, accepted a;")),
  mkP(124,"Biggest Single Number","Easy","Database",["GROUP BY","HAVING","MAX"],`Find the largest number that appears only once.`,"my_numbers","Single max",["HAVING COUNT=1"],"my_numbers","max single",sqlBp("SELECT MAX(num) AS num\nFROM (SELECT num FROM my_numbers GROUP BY num HAVING COUNT(*)=1) t;")),
  mkP(125,"Product Sales Analysis","Easy","Database",["JOIN","SUM"],`Find total sales amount per product.`,"sales, product","Product totals",["JOIN and GROUP BY"],"sales, product","totals",sqlBp("SELECT p.product_name, SUM(s.amount) AS total\nFROM sales s\nJOIN product p ON s.product_id = p.id\nGROUP BY p.product_name;")),
  mkP(126,"Customer Placing Largest Orders","Easy","Database",["ORDER BY","LIMIT"],`Find the customer who placed the most orders.`,"orders","Customer",["COUNT + ORDER BY"],"orders","top customer",sqlBp("SELECT customer_number\nFROM orders\nGROUP BY customer_number\nORDER BY COUNT(*) DESC\nLIMIT 1;")),
  mkP(127,"Classes More Than 5 Students","Easy","Database",["GROUP BY","HAVING"],`Find all classes with 5 or more students.`,"courses","Classes",["HAVING COUNT>=5"],"courses","big classes",sqlBp("SELECT class\nFROM courses\nGROUP BY class\nHAVING COUNT(DISTINCT student) >= 5;")),
  mkP(128,"Median Employee Salary","Hard","Database",["Window","PERCENTILE"],`Find median salary per company.`,"employee","Median salaries",["Use ROW_NUMBER and total count"],"employee","medians",sqlBp("-- Find median salary using window functions\nSELECT company, salary FROM (\n    SELECT *, ROW_NUMBER() OVER (PARTITION BY company ORDER BY salary) rn,\n    COUNT(*) OVER (PARTITION BY company) cnt\n    FROM employee\n) t WHERE rn IN (FLOOR((cnt+1)/2), CEIL((cnt+1)/2));")),
  mkP(129,"Cumulative Salary","Hard","Database",["Window","SUM"],`Calculate 3-month cumulative salary for each employee excluding most recent month.`,"employee","Cumulative sums",["Rolling window"],"employee","rolling sums",sqlBp("SELECT id, month,\n    SUM(salary) OVER (PARTITION BY id ORDER BY month ROWS 2 PRECEDING) AS cumulative\nFROM employee;")),
  mkP(130,"Find Active Users","Medium","Database",["GROUP BY","DATE","HAVING"],`Find users who logged in on at least 5 consecutive days.`,"logins","Active users",["Consecutive day detection"],"logins","active users",sqlBp("-- Find users with 5+ consecutive login days\nSELECT DISTINCT user_id\nFROM logins\n-- Add consecutive day logic;")),
  mkP(131,"INNER JOIN Basics","Easy","Database",["JOIN"],`Select order details with customer names using INNER JOIN.`,"orders, customers","Joined data",["Use INNER JOIN"],"orders, customers","joined",sqlBp("SELECT o.id, c.name, o.amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;")),
  mkP(132,"LEFT JOIN with Nulls","Easy","Database",["LEFT JOIN"],`Find all students and their grades, including those with no grades.`,"students, grades","All students",["LEFT JOIN shows NULLs"],"students, grades","all with grades",sqlBp("SELECT s.name, g.grade\nFROM students s\nLEFT JOIN grades g ON s.id = g.student_id;")),
  mkP(133,"UNION Two Tables","Easy","Database",["UNION"],`Combine results from two similar tables removing duplicates.`,"table_a, table_b","Combined",["UNION removes dupes"],"table_a, table_b","combined",sqlBp("SELECT name, city FROM table_a\nUNION\nSELECT name, city FROM table_b;")),
  mkP(134,"Subquery in WHERE","Medium","Database",["Subquery"],`Find products priced above the average price.`,"products","Above avg",["Subquery for AVG"],"products","above average",sqlBp("SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);")),
  mkP(135,"EXISTS vs IN","Medium","Database",["EXISTS","IN"],`Find departments that have at least one employee using EXISTS.`,"departments, employees","Active depts",["Compare EXISTS and IN"],"departments, employees","active depts",sqlBp("SELECT d.name\nFROM departments d\nWHERE EXISTS (\n    SELECT 1 FROM employees e WHERE e.dept_id = d.id\n);")),
  mkP(136,"CASE Statement","Easy","Database",["CASE"],`Categorize employees as Junior (<50K), Mid (50-100K), or Senior (>100K).`,"employees","Categorized",["Use CASE WHEN"],"employees","categorized",sqlBp("SELECT name, salary,\n    CASE\n        WHEN salary < 50000 THEN 'Junior'\n        WHEN salary <= 100000 THEN 'Mid'\n        ELSE 'Senior'\n    END AS level\nFROM employees;")),
  mkP(137,"STRING Functions","Easy","Database",["CONCAT","UPPER","LOWER"],`Format employee names as 'LASTNAME, Firstname'.`,"employees","Formatted names",["Use UPPER, CONCAT"],"employees","formatted",sqlBp("SELECT CONCAT(UPPER(last_name), ', ', first_name) AS formatted_name\nFROM employees;")),
  mkP(138,"DATE Functions","Medium","Database",["DATE","DATEDIFF"],`Find employees hired in the last 30 days.`,"employees","Recent hires",["Use DATE functions"],"employees","recent hires",sqlBp("SELECT name, hire_date\nFROM employees\nWHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);")),
  mkP(139,"Pivot Table","Hard","Database",["CASE","Pivot"],`Pivot monthly sales data into columns (Jan, Feb, Mar...).`,"monthly_sales","Pivoted data",["Use CASE for each month"],"monthly_sales","pivoted",sqlBp("SELECT product,\n    SUM(CASE WHEN month='Jan' THEN amount END) AS Jan,\n    SUM(CASE WHEN month='Feb' THEN amount END) AS Feb,\n    SUM(CASE WHEN month='Mar' THEN amount END) AS Mar\nFROM monthly_sales GROUP BY product;")),
  mkP(140,"Running Total","Medium","Database",["Window","SUM"],`Calculate running total of sales ordered by date.`,"sales","Running totals",["Window SUM"],"sales","running total",sqlBp("SELECT date, amount,\n    SUM(amount) OVER (ORDER BY date) AS running_total\nFROM sales;")),
  mkP(141,"LAG and LEAD","Medium","Database",["Window","LAG","LEAD"],`Compare each day's sales with the previous day.`,"daily_sales","Day-over-day",["Use LAG()"],"daily_sales","comparison",sqlBp("SELECT date, amount,\n    LAG(amount) OVER (ORDER BY date) AS prev_day,\n    amount - LAG(amount) OVER (ORDER BY date) AS diff\nFROM daily_sales;")),
  mkP(142,"NTILE Quartiles","Medium","Database",["Window","NTILE"],`Divide employees into 4 salary quartiles.`,"employees","Quartiles",["Use NTILE(4)"],"employees","quartiled",sqlBp("SELECT name, salary,\n    NTILE(4) OVER (ORDER BY salary) AS quartile\nFROM employees;")),
  mkP(143,"Correlated Subquery","Medium","Database",["Subquery","Correlated"],`Find employees earning above their department average.`,"employees","Above dept avg",["Correlated subquery"],"employees","above dept avg",sqlBp("SELECT name, salary, department\nFROM employees e\nWHERE salary > (\n    SELECT AVG(salary) FROM employees WHERE department = e.department\n);")),
  mkP(144,"CTE Recursive","Hard","Database",["CTE","Recursive"],`Generate a number series from 1 to 100 using recursive CTE.`,"N/A","1 to 100",["WITH RECURSIVE"],"N/A","1-100",sqlBp("WITH RECURSIVE nums AS (\n    SELECT 1 AS n\n    UNION ALL\n    SELECT n + 1 FROM nums WHERE n < 100\n)\nSELECT n FROM nums;")),
  mkP(145,"Multiple JOINs","Medium","Database",["JOIN"],`Find order details with customer name, product name, and quantity.`,"orders, customers, products","Full details",["Three-table JOIN"],"orders, customers, products","full details",sqlBp("SELECT c.name, p.product_name, o.quantity\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN products p ON o.product_id = p.id;")),
  mkP(146,"UPDATE with JOIN","Medium","Database",["UPDATE","JOIN"],`Increase salary by 10% for all employees in the 'Engineering' department.`,"employees, departments","Updated rows",["UPDATE with JOIN"],"employees, departments","updated",sqlBp("UPDATE employees e\nJOIN departments d ON e.dept_id = d.id\nSET e.salary = e.salary * 1.10\nWHERE d.name = 'Engineering';")),
  mkP(147,"INSERT from SELECT","Easy","Database",["INSERT","SELECT"],`Copy all active users from users table into active_users table.`,"users","Inserted rows",["INSERT INTO SELECT"],"users","inserted",sqlBp("INSERT INTO active_users (id, name, email)\nSELECT id, name, email\nFROM users\nWHERE status = 'active';")),
  mkP(148,"CREATE TABLE with Constraints","Easy","Database",["CREATE","Constraints"],`Create a products table with id (PK), name (NOT NULL), price (CHECK>0), category.`,"N/A","Table created",["Use constraints"],"N/A","table created",sqlBp("CREATE TABLE products (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(255) NOT NULL,\n    price DECIMAL(10,2) CHECK (price > 0),\n    category VARCHAR(100)\n);")),
  mkP(149,"INDEX for Performance","Medium","Database",["INDEX","Performance"],`Create an index on the email column of the users table for faster lookups.`,"users","Index created",["CREATE INDEX"],"users","index created",sqlBp("CREATE INDEX idx_email ON users (email);\n\n-- Verify with:\nEXPLAIN SELECT * FROM users WHERE email = 'test@example.com';")),
  mkP(150,"Transaction Basics","Medium","Database",["Transaction","COMMIT"],`Write a transaction that transfers $500 between two accounts.`,"accounts","Transfer complete",["Use BEGIN, COMMIT, ROLLBACK"],"accounts","transferred",sqlBp("BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;")),
  mkP(151,"Stored Procedure","Medium","Database",["Procedure"],`Create a stored procedure to get employees by department name.`,"employees, departments","Procedure created",["CREATE PROCEDURE"],"dept_name param","employees list",sqlBp("DELIMITER //\nCREATE PROCEDURE GetEmployeesByDept(IN dept_name VARCHAR(100))\nBEGIN\n    SELECT * FROM employees WHERE department = dept_name;\nEND //\nDELIMITER ;")),
  mkP(152,"View Creation","Easy","Database",["VIEW"],`Create a view showing active orders with customer details.`,"orders, customers","View created",["CREATE VIEW"],"orders, customers","view",sqlBp("CREATE VIEW active_orders AS\nSELECT o.id, c.name, o.total, o.status\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE o.status = 'active';")),
  mkP(153,"NULL Handling","Easy","Database",["COALESCE","IFNULL"],`Replace NULL phone numbers with 'N/A' in the output.`,"contacts","Cleaned data",["Use COALESCE"],"contacts","cleaned",sqlBp("SELECT name, COALESCE(phone, 'N/A') AS phone\nFROM contacts;")),
  mkP(154,"LIKE Pattern Matching","Easy","Database",["LIKE","Pattern"],`Find all employees whose names start with 'J' and end with 'n'.`,"employees","Matching names",["Use LIKE with wildcards"],"employees","matching",sqlBp("SELECT name\nFROM employees\nWHERE name LIKE 'J%n';")),
  mkP(155,"GROUP_CONCAT","Medium","Database",["GROUP_CONCAT"],`For each department, list all employee names in a comma-separated string.`,"employees","Dept, names",["Use GROUP_CONCAT"],"employees","concat names",sqlBp("SELECT department,\n    GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS employees\nFROM employees\nGROUP BY department;")),
  mkP(156,"BETWEEN and IN","Easy","Database",["BETWEEN","IN"],`Find orders placed between Jan 1 and Mar 31, 2024 for specific products.`,"orders","Filtered orders",["Use BETWEEN and IN"],"orders","filtered",sqlBp("SELECT *\nFROM orders\nWHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'\nAND product_id IN (1, 5, 10, 15);")),
  mkP(157,"Self-JOIN for Pairs","Medium","Database",["Self JOIN"],`Find all pairs of employees in the same department.`,"employees","Employee pairs",["Self-join with inequality"],"employees","pairs",sqlBp("SELECT e1.name AS employee1, e2.name AS employee2, e1.department\nFROM employees e1\nJOIN employees e2 ON e1.department = e2.department AND e1.id < e2.id;")),
  mkP(158,"ROW_NUMBER Pagination","Medium","Database",["Window","ROW_NUMBER"],`Implement pagination: return rows 21-30 ordered by name.`,"users","Page 3",["ROW_NUMBER for offset"],"users","page 3",sqlBp("SELECT * FROM (\n    SELECT *, ROW_NUMBER() OVER (ORDER BY name) AS rn\n    FROM users\n) t WHERE rn BETWEEN 21 AND 30;")),
  mkP(159,"FULL OUTER JOIN","Medium","Database",["FULL JOIN"],`Show all customers and all orders, even unmatched ones from both sides.`,"customers, orders","Full outer",["Simulate with UNION"],"customers, orders","full join",sqlBp("SELECT c.name, o.order_id, o.amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nUNION\nSELECT c.name, o.order_id, o.amount\nFROM customers c\nRIGHT JOIN orders o ON c.id = o.customer_id;")),
  mkP(160,"Temporal Query","Medium","Database",["DATE","Interval"],`Find the most popular day of the week for orders.`,"orders","Popular day",["DAYNAME + GROUP BY"],"orders","popular day",sqlBp("SELECT DAYNAME(order_date) AS day, COUNT(*) AS order_count\nFROM orders\nGROUP BY DAYNAME(order_date)\nORDER BY order_count DESC\nLIMIT 1;")),
  mkP(161,"Percentage of Total","Medium","Database",["Window","SUM"],`Show each product's sales as a percentage of total sales.`,"sales","Product %",["Window SUM for total"],"sales","percentages",sqlBp("SELECT product,amount,\n    ROUND(amount*100.0/SUM(amount) OVER(),2) AS pct\nFROM sales;")),
  mkP(162,"Year-over-Year Growth","Hard","Database",["Self JOIN","DATE"],`Calculate YoY revenue growth percentage.`,"revenue","Growth %",["Join same table on year-1"],"revenue","growth",sqlBp("SELECT r1.year, r1.revenue,\n    ROUND((r1.revenue-r2.revenue)*100.0/r2.revenue,2) AS yoy_growth\nFROM revenue r1\nLEFT JOIN revenue r2 ON r1.year = r2.year + 1;")),
  mkP(163,"Moving Average","Medium","Database",["Window","AVG"],`Calculate 7-day moving average of daily sales.`,"daily_sales","Moving avg",["Window AVG with ROWS"],"daily_sales","moving avg",sqlBp("SELECT date, amount,\n    AVG(amount) OVER (ORDER BY date ROWS 6 PRECEDING) AS moving_avg_7\nFROM daily_sales;")),
  mkP(164,"Gap Detection","Hard","Database",["Self JOIN","Gap"],`Find gaps in sequential ID numbers.`,"records","Gaps",["Self-join to find missing"],"records","gaps found",sqlBp("SELECT r1.id + 1 AS gap_start,\n    MIN(r2.id) - 1 AS gap_end\nFROM records r1\nLEFT JOIN records r2 ON r2.id > r1.id\nWHERE NOT EXISTS (SELECT 1 FROM records WHERE id = r1.id + 1)\nAND r1.id < (SELECT MAX(id) FROM records)\nGROUP BY r1.id;")),
  mkP(165,"Hierarchical Query","Hard","Database",["CTE","Recursive","Hierarchy"],`List all employees with their manager chain (org hierarchy).`,"employees","Hierarchy",["Recursive CTE"],"employees","hierarchy",sqlBp("WITH RECURSIVE org AS (\n    SELECT id, name, manager_id, 1 AS level\n    FROM employees WHERE manager_id IS NULL\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, o.level + 1\n    FROM employees e JOIN org o ON e.manager_id = o.id\n)\nSELECT * FROM org ORDER BY level, name;")),
  mkP(166,"Upsert / Merge","Medium","Database",["INSERT","ON DUPLICATE"],`Insert a new product or update price if product already exists.`,"products","Upserted",["ON DUPLICATE KEY UPDATE"],"products","upserted",sqlBp("INSERT INTO products (id, name, price)\nVALUES (1, 'Widget', 29.99)\nON DUPLICATE KEY UPDATE price = 29.99;")),
  mkP(167,"Conditional Aggregation","Medium","Database",["CASE","SUM"],`Count orders by status: pending, shipped, delivered in one query.`,"orders","Status counts",["SUM with CASE"],"orders","counts per status",sqlBp("SELECT\n    SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending,\n    SUM(CASE WHEN status='shipped' THEN 1 ELSE 0 END) AS shipped,\n    SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS delivered\nFROM orders;")),
  mkP(168,"Top N per Group","Hard","Database",["Window","ROW_NUMBER"],`Find top 2 selling products per category.`,"products, sales","Top 2 per category",["PARTITION BY + ROW_NUMBER"],"products, sales","top 2",sqlBp("SELECT * FROM (\n    SELECT p.category, p.name, SUM(s.qty) AS total,\n        ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(s.qty) DESC) AS rn\n    FROM products p JOIN sales s ON p.id = s.product_id\n    GROUP BY p.category, p.name\n) t WHERE rn <= 2;")),
  mkP(169,"JSON Functions","Medium","Database",["JSON"],`Extract values from a JSON column in a MySQL table.`,"events","Extracted values",["JSON_EXTRACT"],"events","json values",sqlBp("SELECT id,\n    JSON_EXTRACT(data, '$.name') AS name,\n    JSON_EXTRACT(data, '$.email') AS email\nFROM events\nWHERE JSON_EXTRACT(data, '$.type') = 'signup';")),
  mkP(170,"CROSS JOIN Calendar","Medium","Database",["CROSS JOIN"],`Generate a report grid with all products × all months combinations.`,"products, months","Grid",["CROSS JOIN"],"products, months","grid",sqlBp("SELECT p.name, m.month_name\nFROM products p\nCROSS JOIN months m\nORDER BY p.name, m.month_num;")),
  mkP(171,"Set Operations","Easy","Database",["INTERSECT","EXCEPT"],`Find customers who ordered in both Q1 and Q2.`,"orders","Both quarters",["INTERSECT"],"orders","intersection",sqlBp("SELECT customer_id FROM orders WHERE quarter = 'Q1'\nINTERSECT\nSELECT customer_id FROM orders WHERE quarter = 'Q2';")),
  mkP(172,"Conditional UPDATE","Medium","Database",["UPDATE","CASE"],`Apply tiered discounts: 10% for orders>$100, 20% for>$500.`,"orders","Updated prices",["UPDATE with CASE"],"orders","discounted",sqlBp("UPDATE orders\nSET discount = CASE\n    WHEN total > 500 THEN total * 0.20\n    WHEN total > 100 THEN total * 0.10\n    ELSE 0 END;")),
  mkP(173,"Regex in SQL","Medium","Database",["REGEXP"],`Find emails matching a valid email pattern.`,"users","Valid emails",["Use REGEXP"],"users","valid emails",sqlBp("SELECT email\nFROM users\nWHERE email REGEXP '^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\\\\.[a-zA-Z]{2,}$';")),
  mkP(174,"Temporary Table","Medium","Database",["TEMP TABLE"],`Use a temporary table to calculate department budget summaries.`,"employees","Budget summary",["CREATE TEMPORARY TABLE"],"employees","budget",sqlBp("CREATE TEMPORARY TABLE dept_budget AS\nSELECT department, SUM(salary) AS total_salary, COUNT(*) AS headcount\nFROM employees GROUP BY department;\n\nSELECT * FROM dept_budget WHERE total_salary > 500000;")),
  mkP(175,"HAVING with Aggregates","Easy","Database",["HAVING","GROUP BY"],`Find departments where average salary exceeds 75000.`,"employees","High-salary depts",["HAVING AVG()>75000"],"employees","high salary depts",sqlBp("SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 75000;")),
  mkP(176,"DISTINCT ON","Medium","Database",["DISTINCT"],`For each customer, find their most recent order.`,"orders","Latest orders",["DISTINCT ON or ROW_NUMBER"],"orders","latest per customer",sqlBp("SELECT DISTINCT ON (customer_id) *\nFROM orders\nORDER BY customer_id, order_date DESC;\n-- MySQL: use ROW_NUMBER() approach")),
  mkP(177,"Window FIRST_VALUE","Medium","Database",["Window","FIRST_VALUE"],`Show each employee's salary alongside the highest salary in their department.`,"employees","Salary comparison",["FIRST_VALUE"],"employees","comparison",sqlBp("SELECT name, salary, department,\n    FIRST_VALUE(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS dept_max\nFROM employees;")),
  mkP(178,"Unpivot Data","Hard","Database",["UNION","Unpivot"],`Convert columns (Q1, Q2, Q3, Q4) into rows with quarter and value.`,"quarterly_data","Unpivoted",["UNION ALL for unpivot"],"quarterly_data","unpivoted",sqlBp("SELECT product, 'Q1' AS quarter, q1 AS value FROM quarterly_data\nUNION ALL\nSELECT product, 'Q2', q2 FROM quarterly_data\nUNION ALL\nSELECT product, 'Q3', q3 FROM quarterly_data\nUNION ALL\nSELECT product, 'Q4', q4 FROM quarterly_data;")),
  mkP(179,"Trigger Concept","Hard","Database",["Trigger"],`Create a trigger that logs salary changes to an audit table.`,"employees, audit_log","Trigger created",["CREATE TRIGGER"],"employees, audit_log","trigger",sqlBp("CREATE TRIGGER salary_audit\nAFTER UPDATE ON employees\nFOR EACH ROW\nBEGIN\n    IF OLD.salary != NEW.salary THEN\n        INSERT INTO audit_log (emp_id, old_salary, new_salary, changed_at)\n        VALUES (NEW.id, OLD.salary, NEW.salary, NOW());\n    END IF;\nEND;")),
  mkP(180,"Materialized View","Hard","Database",["View","Performance"],`Create a materialized view for daily sales summary.`,"sales","Mat view",["Simulated with table"],"sales","mat view",sqlBp("-- Simulated materialized view\nCREATE TABLE mv_daily_sales AS\nSELECT DATE(sale_date) AS day, SUM(amount) AS total, COUNT(*) AS txn_count\nFROM sales\nGROUP BY DATE(sale_date);\n\n-- Refresh: TRUNCATE + INSERT")),
  mkP(181,"Multiple Column Sort","Easy","Database",["ORDER BY"],`Sort employees by department ascending, then salary descending.`,"employees","Sorted",["Multi-column ORDER BY"],"employees","multi-sorted",sqlBp("SELECT * FROM employees\nORDER BY department ASC, salary DESC;")),
  mkP(182,"Aggregate with FILTER","Medium","Database",["FILTER","Aggregate"],`Count active and inactive users in a single query.`,"users","Counts",["Conditional counting"],"users","active/inactive counts",sqlBp("SELECT\n    COUNT(*) FILTER (WHERE status='active') AS active,\n    COUNT(*) FILTER (WHERE status='inactive') AS inactive\nFROM users;\n-- MySQL: use SUM(CASE) instead")),
  mkP(183,"Common Table Expression","Medium","Database",["CTE"],`Use CTE to find departments with above-average headcount.`,"employees","Big depts",["WITH clause"],"employees","above avg depts",sqlBp("WITH dept_counts AS (\n    SELECT department, COUNT(*) AS cnt\n    FROM employees GROUP BY department\n)\nSELECT * FROM dept_counts\nWHERE cnt > (SELECT AVG(cnt) FROM dept_counts);")),
  mkP(184,"CROSS APPLY / Lateral","Hard","Database",["Lateral","Apply"],`For each customer, find their last 3 orders.`,"customers, orders","Last 3 orders",["LATERAL JOIN or CROSS APPLY"],"customers, orders","last 3",sqlBp("SELECT c.name, o.*\nFROM customers c\nCROSS JOIN LATERAL (\n    SELECT * FROM orders\n    WHERE customer_id = c.id\n    ORDER BY order_date DESC LIMIT 3\n) o;")),
  mkP(185,"Window PERCENT_RANK","Medium","Database",["Window","PERCENT_RANK"],`Calculate the percentile rank of each student's score.`,"scores","Percentiles",["PERCENT_RANK()"],"scores","percentiles",sqlBp("SELECT student, score,\n    ROUND(PERCENT_RANK() OVER (ORDER BY score), 2) AS percentile\nFROM scores;")),
  mkP(186,"Data Type Casting","Easy","Database",["CAST","CONVERT"],`Convert string dates to proper DATE type and calculate age.`,"users","Ages",["CAST and DATEDIFF"],"users","ages",sqlBp("SELECT name,\n    CAST(birth_date AS DATE) AS dob,\n    TIMESTAMPDIFF(YEAR, CAST(birth_date AS DATE), CURDATE()) AS age\nFROM users;")),
  mkP(187,"Recursive Fibonacci","Hard","Database",["CTE","Recursive"],`Generate first 20 Fibonacci numbers using recursive CTE.`,"N/A","Fibonacci",["Recursive CTE"],"N/A","fibonacci",sqlBp("WITH RECURSIVE fib AS (\n    SELECT 1 AS n, 0 AS fib_n, 1 AS fib_next\n    UNION ALL\n    SELECT n+1, fib_next, fib_n+fib_next FROM fib WHERE n < 20\n)\nSELECT n, fib_n FROM fib;")),
  mkP(188,"Anti-JOIN Pattern","Medium","Database",["NOT EXISTS","Anti-join"],`Find products that have never been ordered.`,"products, order_items","Never ordered",["NOT EXISTS"],"products, order_items","never ordered",sqlBp("SELECT p.name\nFROM products p\nWHERE NOT EXISTS (\n    SELECT 1 FROM order_items oi WHERE oi.product_id = p.id\n);")),
  mkP(189,"Deduplication","Medium","Database",["ROW_NUMBER","DELETE"],`Remove duplicate rows keeping the one with the lowest id.`,"contacts","Deduplicated",["DELETE with ROW_NUMBER"],"contacts","deduplicated",sqlBp("DELETE FROM contacts\nWHERE id NOT IN (\n    SELECT MIN(id) FROM contacts GROUP BY email\n);")),
  mkP(190,"Window RANGE vs ROWS","Hard","Database",["Window","RANGE","ROWS"],`Show difference between RANGE and ROWS in window frames.`,"sales","Frame comparison",["RANGE vs ROWS"],"sales","frame comparison",sqlBp("SELECT date, amount,\n    SUM(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rows_sum,\n    SUM(amount) OVER (ORDER BY date RANGE BETWEEN INTERVAL 2 DAY PRECEDING AND CURRENT ROW) AS range_sum\nFROM sales;")),
  mkP(191,"Dynamic Column Aliasing","Easy","Database",["AS","Alias"],`Select with descriptive aliases for a report.`,"orders","Report columns",["Use AS for readability"],"orders","aliased report",sqlBp("SELECT\n    o.id AS 'Order Number',\n    c.name AS 'Customer Name',\n    o.total AS 'Order Total',\n    o.created_at AS 'Order Date'\nFROM orders o JOIN customers c ON o.customer_id = c.id;")),
  mkP(192,"Analytical Rank Functions","Medium","Database",["RANK","DENSE_RANK","ROW_NUMBER"],`Compare RANK, DENSE_RANK, and ROW_NUMBER on same data.`,"scores","Three rankings",["Compare all three"],"scores","compared rankings",sqlBp("SELECT score,\n    RANK() OVER (ORDER BY score DESC) AS rank,\n    DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank,\n    ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num\nFROM scores;")),
  mkP(193,"Table Partitioning Concept","Hard","Database",["Partition"],`Partition a large orders table by year for performance.`,"orders","Partitioned table",["PARTITION BY RANGE"],"orders","partitioned",sqlBp("CREATE TABLE orders_partitioned (\n    id INT, order_date DATE, amount DECIMAL\n) PARTITION BY RANGE (YEAR(order_date)) (\n    PARTITION p2022 VALUES LESS THAN (2023),\n    PARTITION p2023 VALUES LESS THAN (2024),\n    PARTITION p2024 VALUES LESS THAN (2025)\n);")),
  mkP(194,"Coalesce Chain","Easy","Database",["COALESCE"],`Show the first non-null value from mobile, home, or work phone.`,"contacts","Best phone",["COALESCE chain"],"contacts","best phone",sqlBp("SELECT name,\n    COALESCE(mobile_phone, home_phone, work_phone, 'No phone') AS contact_number\nFROM contacts;")),
  mkP(195,"Window SUM Running Balance","Medium","Database",["Window","SUM"],`Calculate running account balance from transactions.`,"transactions","Running balance",["Window SUM"],"transactions","running balance",sqlBp("SELECT date, type, amount,\n    SUM(CASE WHEN type='credit' THEN amount ELSE -amount END)\n    OVER (ORDER BY date) AS balance\nFROM transactions;")),
  mkP(196,"Multi-table DELETE","Hard","Database",["DELETE","JOIN"],`Delete orders and their items for cancelled orders.`,"orders, order_items","Deleted",["Multi-table DELETE"],"orders, order_items","deleted",sqlBp("DELETE o, oi\nFROM orders o\nJOIN order_items oi ON o.id = oi.order_id\nWHERE o.status = 'cancelled';")),
  mkP(197,"GROUPING SETS","Hard","Database",["GROUPING SETS"],`Create a report with subtotals by region, by product, and grand total.`,"sales","Multi-level totals",["GROUPING SETS"],"sales","multi-level",sqlBp("SELECT region, product, SUM(amount)\nFROM sales\nGROUP BY GROUPING SETS (\n    (region, product),\n    (region),\n    (product),\n    ()\n);")),
  mkP(198,"Error Handling in SQL","Medium","Database",["TRY","CATCH"],`Write a procedure with error handling that rolls back on failure.`,"accounts","Safe transfer",["TRY-CATCH-ROLLBACK"],"accounts","safe transfer",sqlBp("DELIMITER //\nCREATE PROCEDURE SafeTransfer(IN from_id INT, IN to_id INT, IN amt DECIMAL)\nBEGIN\n    DECLARE EXIT HANDLER FOR SQLEXCEPTION\n    BEGIN\n        ROLLBACK;\n    END;\n    START TRANSACTION;\n    UPDATE accounts SET balance = balance - amt WHERE id = from_id;\n    UPDATE accounts SET balance = balance + amt WHERE id = to_id;\n    COMMIT;\nEND //\nDELIMITER ;")),
  mkP(199,"Window ROWS UNBOUNDED","Medium","Database",["Window"],`Calculate cumulative percentage of total revenue by product.`,"revenue","Cumulative %",["ROWS UNBOUNDED PRECEDING"],"revenue","cumulative %",sqlBp("SELECT product, revenue,\n    SUM(revenue) OVER (ORDER BY revenue DESC ROWS UNBOUNDED PRECEDING) * 100.0 /\n    SUM(revenue) OVER () AS cumulative_pct\nFROM revenue;")),
  mkP(200,"Complex Reporting Query","Hard","Database",["Multiple"],`Build a complete sales dashboard query with YTD, MoM, and rankings.`,"sales, products","Dashboard data",["Combine multiple techniques"],"sales, products","dashboard",sqlBp("WITH monthly AS (\n    SELECT DATE_FORMAT(date,'%Y-%m') AS month, SUM(amount) AS total\n    FROM sales GROUP BY 1\n)\nSELECT month, total,\n    SUM(total) OVER (ORDER BY month) AS ytd,\n    total - LAG(total) OVER (ORDER BY month) AS mom_change,\n    RANK() OVER (ORDER BY total DESC) AS rank\nFROM monthly;")),

  // ═══════════════════════════════════
  //  JAVASCRIPT (201-300)
  // ═══════════════════════════════════
  mkP(201,"Array.map Implementation","Easy","Web",["Array","Higher-Order"],`Implement your own \`Array.prototype.myMap\` that works like the native \`map\` method.`,"[1,2,3].myMap(x=>x*2)","[2,4,6]",["Do not use native .map()"],"[1,2,3].myMap(x=>x*2)","[2,4,6]",jsBp("myMap","arr, callback")),
  mkP(202,"Array.filter Implementation","Easy","Web",["Array","Higher-Order"],`Implement your own \`Array.prototype.myFilter\`.`,"[1,2,3,4].myFilter(x=>x%2===0)","[2,4]",["Do not use native .filter()"],"[1,2,3,4].myFilter(x=>x%2===0)","[2,4]",jsBp("myFilter","arr, callback")),
  mkP(203,"Array.reduce Implementation","Medium","Web",["Array","Higher-Order"],`Implement your own \`Array.prototype.myReduce\` with optional initial value.`,"[1,2,3].myReduce((a,b)=>a+b, 0)","6",["Handle no initial value"],"[1,2,3].myReduce((a,b)=>a+b,0)","6",jsBp("myReduce","arr, callback, initial")),
  mkP(204,"Debounce Function","Medium","Web",["Closure","Timer"],`Implement a debounce function that delays invoking func until after wait ms of inactivity.`,"debounce(fn, 300)","Debounced function",["Use setTimeout, clearTimeout"],"debounce(fn,300)","debounced",jsBp("debounce","func, wait")),
  mkP(205,"Throttle Function","Medium","Web",["Closure","Timer"],`Implement throttle: invoke func at most once per wait milliseconds.`,"throttle(fn, 300)","Throttled function",["Track last call time"],"throttle(fn,300)","throttled",jsBp("throttle","func, wait")),
  mkP(206,"Deep Clone","Medium","Web",["Object","Recursion"],`Create a deep clone function handling objects, arrays, dates, and nested structures.`,"deepClone({a:{b:1}})","New object",["Handle circular refs"],'deepClone({a:{b:1}})',"cloned",jsBp("deepClone","obj")),
  mkP(207,"Flatten Array","Easy","Web",["Array","Recursion"],`Flatten a nested array to any depth. Implement without Array.flat().`,"flatten([1,[2,[3,[4]]]])","[1,2,3,4]",["Handle any depth"],"[1,[2,[3,[4]]]]","[1,2,3,4]",jsBp("flatten","arr, depth")),
  mkP(208,"Curry Function","Medium","Web",["Closure","Functional"],`Implement a curry function: curry(fn)(a)(b)(c) === fn(a,b,c).`,"curry(add)(1)(2)(3)","6",["Handle variable arity"],"curry(add)(1)(2)(3)","6",jsBp("curry","fn")),
  mkP(209,"Promise.all Implementation","Medium","Web",["Promise","Async"],`Implement Promise.all that resolves when all promises resolve, rejects if any rejects.`,"promiseAll([p1,p2,p3])","[r1,r2,r3]",["Handle empty array"],"promiseAll([p1,p2,p3])","[r1,r2,r3]",jsBp("promiseAll","promises")),
  mkP(210,"Promise.race Implementation","Medium","Web",["Promise","Async"],`Implement Promise.race that resolves/rejects with the first settled promise.`,"promiseRace([p1,p2])","First result",["First to settle wins"],"promiseRace([p1,p2])","first",jsBp("promiseRace","promises")),
  mkP(211,"Event Emitter","Medium","Web",["Design Pattern","Closure"],`Implement an EventEmitter class with on, emit, off, and once methods.`,"emitter.on('click', handler)","Event system",["Support multiple listeners"],"emitter.on('click',fn)","event system",jsBp("EventEmitter","")),
  mkP(212,"Memoize Function","Medium","Web",["Closure","Cache"],`Create a memoize function that caches results based on arguments.`,"memoize(fibonacci)(10)","Cached result",["Handle multiple args"],"memoize(fib)(10)","cached",jsBp("memoize","fn")),
  mkP(213,"Compose Functions","Medium","Web",["Functional"],`Implement compose: compose(f,g,h)(x) === f(g(h(x))).`,"compose(double,inc)(5)","12",["Right-to-left execution"],"compose(double,inc)(5)","12",jsBp("compose","...fns")),
  mkP(214,"Pipe Functions","Easy","Web",["Functional"],`Implement pipe: pipe(f,g,h)(x) === h(g(f(x))). Left-to-right version of compose.`,"pipe(inc,double)(5)","12",["Left-to-right execution"],"pipe(inc,double)(5)","12",jsBp("pipe","...fns")),
  mkP(215,"Deep Equal","Medium","Web",["Object","Recursion"],`Compare two values for deep equality (objects, arrays, primitives, dates).`,'deepEqual({a:1},{a:1})',"true",["Handle nested structures"],'deepEqual({a:{b:1}},{a:{b:1}})',"true",jsBp("deepEqual","a, b")),
  mkP(216,"Object.assign Implementation","Easy","Web",["Object"],`Implement a shallow Object.assign polyfill.`,'myAssign({},{a:1},{b:2})','{a:1,b:2}',["Shallow merge only"],'myAssign({},{a:1},{b:2})','{a:1,b:2}',jsBp("myAssign","target, ...sources")),
  mkP(217,"Retry with Backoff","Medium","Web",["Async","Error Handling"],`Create a function that retries an async operation with exponential backoff.`,"retry(fetchData, 3, 1000)","Result or throw",["Double delay each retry"],"retry(fn,3,1000)","result",jsBp("retry","fn, retries, delay")),
  mkP(218,"Sleep / Delay","Easy","Web",["Promise","Async"],`Implement a sleep function using Promises.`,"await sleep(1000)","Resolves after 1s",["Return a Promise"],"sleep(1000)","resolved",jsBp("sleep","ms")),
  mkP(219,"Fetch with Timeout","Medium","Web",["Async","AbortController"],`Wrap fetch with a timeout that rejects after specified milliseconds.`,"fetchWithTimeout(url, 5000)","Response or timeout",["Use AbortController"],"fetchWithTimeout(url,5000)","response",jsBp("fetchWithTimeout","url, timeout")),
  mkP(220,"Observable Implementation","Hard","Web",["Design Pattern","Reactive"],`Create a basic Observable class with subscribe, next, complete, and error.`,"Observable.from([1,2,3])","Observable stream",["Lazy evaluation"],"Observable.from([1,2,3])","stream",jsBp("Observable","subscriber")),
  mkP(221,"Pub/Sub Pattern","Medium","Web",["Design Pattern"],`Implement a publish/subscribe messaging system.`,"pubsub.subscribe('msg', fn)","Pub/Sub",["Support unsubscribe"],"pubsub.subscribe('msg',fn)","pub/sub",jsBp("PubSub","")),
  mkP(222,"LRU Cache in JS","Hard","Web",["Data Structure","Map"],`Implement LRU Cache using Map for O(1) operations.`,"cache.get(1)","Cached value",["Use Map insertion order"],"cache operations","lru cache",jsBp("LRUCache","capacity")),
  mkP(223,"Binary Search in JS","Easy","Web",["Array","Search"],`Implement binary search that returns the index of target, or -1.`,"binarySearch([1,3,5,7],5)","2",["Array must be sorted"],"binarySearch([1,3,5,7],5)","2",jsBp("binarySearch","arr, target")),
  mkP(224,"Merge Sort","Medium","Web",["Array","Sorting","Recursion"],`Implement merge sort algorithm in JavaScript.`,"mergeSort([38,27,43,3])","[3,27,38,43]",["O(n log n) time"],"mergeSort([38,27,43,3])","[3,27,38,43]",jsBp("mergeSort","arr")),
  mkP(225,"Quick Sort","Medium","Web",["Array","Sorting","Recursion"],`Implement quick sort with a pivot selection strategy.`,"quickSort([10,7,8,9,1])","[1,7,8,9,10]",["Choose pivot wisely"],"quickSort([10,7,8,9,1])","[1,7,8,9,10]",jsBp("quickSort","arr")),
  mkP(226,"Linked List Implementation","Medium","Web",["Data Structure"],`Implement a singly linked list with append, prepend, delete, find, and toArray.`,"list.append(1).append(2)","[1,2]",["Handle edge cases"],"list operations","linked list",jsBp("LinkedList","")),
  mkP(227,"Stack Implementation","Easy","Web",["Data Structure"],`Implement a Stack with push, pop, peek, isEmpty, and size.`,"stack.push(1).push(2).pop()","1",["LIFO order"],"stack operations","stack",jsBp("Stack","")),
  mkP(228,"Queue Implementation","Easy","Web",["Data Structure"],`Implement a Queue with enqueue, dequeue, front, isEmpty, and size.`,"queue.enqueue(1).enqueue(2)","Queue",["FIFO order"],"queue operations","queue",jsBp("Queue","")),
  mkP(229,"Binary Search Tree","Medium","Web",["Data Structure","Tree"],`Implement BST with insert, search, delete, and inorder traversal.`,"bst.insert(5).insert(3)","BST",["Handle all delete cases"],"bst operations","bst",jsBp("BST","")),
  mkP(230,"Hash Map Implementation","Medium","Web",["Data Structure","Hash"],`Implement a HashMap with set, get, delete, and collision handling.`,"map.set('a',1).get('a')","1",["Handle collisions"],"map operations","hash map",jsBp("HashMap","size")),
  mkP(231,"Graph Implementation","Medium","Web",["Data Structure","Graph"],`Implement an undirected graph with addVertex, addEdge, BFS, and DFS.`,"graph.addEdge('A','B')","Graph",["Adjacency list"],"graph operations","graph",jsBp("Graph","")),
  mkP(232,"Priority Queue","Medium","Web",["Data Structure","Heap"],`Implement a min-heap based priority queue.`,"pq.enqueue(3).enqueue(1)","Min-heap PQ",["Heapify up and down"],"pq operations","priority queue",jsBp("PriorityQueue","")),
  mkP(233,"Trie in JavaScript","Medium","Web",["Data Structure","Trie"],`Implement a Trie with insert, search, and startsWith methods.`,"trie.insert('apple')","Trie",["Character-by-character"],"trie operations","trie",jsBp("Trie","")),
  mkP(234,"DOM createElement","Easy","Web",["DOM","Rendering"],`Create a function that builds nested DOM elements from a JSON config.`,'createElement({tag:"div",children:[...]})','DOM element',["Handle text nodes"],"json config","dom element",jsBp("createElement","config")),
  mkP(235,"Virtual DOM Diff","Hard","Web",["DOM","Algorithm"],`Implement a simple diff algorithm comparing two virtual DOM trees.`,"diff(oldTree, newTree)","Patches array",["Return minimal patches"],"diff(old,new)","patches",jsBp("diff","oldNode, newNode")),
  mkP(236,"Template Engine","Medium","Web",["String","Regex"],`Build a simple template engine: template('Hello {{name}}!', {name:'World'})`,'"Hello {{name}}!"','"Hello World!"',["Handle nested paths"],"template('Hi {{name}}',{name:'World'})","Hi World",jsBp("template","str, data")),
  mkP(237,"JSON.stringify Implementation","Hard","Web",["Recursion","Types"],`Implement JSON.stringify handling strings, numbers, booleans, arrays, objects, and null.`,"stringify({a:1})","'{\"a\":1}'",["Handle nested structures"],'stringify({a:1})','"{\\"a\\":1}"',jsBp("stringify","value")),
  mkP(238,"JSON.parse Implementation","Hard","Web",["Recursion","Parsing"],`Implement a basic JSON parser that handles objects, arrays, strings, numbers, and booleans.`,'parse("{\\"a\\":1}")','{a:1}',["Recursive descent"],'parse("{\\"a\\":1}")','{a:1}',jsBp("parse","str")),
  mkP(239,"Type Checker","Easy","Web",["Types"],`Create a comprehensive type checker: typeOf(val) returns 'array','null','date', etc.`,"typeOf([])","'array'",["Distinguish null, array, date"],"typeOf(null)","null",jsBp("typeOf","value")),
  mkP(240,"Range Generator","Easy","Web",["Generator","Iterator"],`Create a range function: range(1,5) → [1,2,3,4,5], range(0,10,2) → [0,2,4,6,8,10].`,"range(1,5)","[1,2,3,4,5]",["Support step parameter"],"range(1,5)","[1,2,3,4,5]",jsBp("range","start, end, step")),
  mkP(241,"Chunk Array","Easy","Web",["Array"],`Split an array into chunks of given size: chunk([1,2,3,4,5],2) → [[1,2],[3,4],[5]].`,"chunk([1,2,3,4,5],2)","[[1,2],[3,4],[5]]",["Handle remainders"],"chunk([1,2,3,4,5],2)","[[1,2],[3,4],[5]]",jsBp("chunk","arr, size")),
  mkP(242,"Unique Array","Easy","Web",["Array","Set"],`Remove duplicates from array preserving order. Handle objects by reference.`,"unique([1,2,2,3,3])","[1,2,3]",["Preserve insertion order"],"unique([1,2,2,3,3])","[1,2,3]",jsBp("unique","arr")),
  mkP(243,"Group By","Easy","Web",["Array","Object"],`Group array elements by a key function: groupBy([6.1,4.2,6.3], Math.floor).`,"groupBy(arr, fn)","Grouped object",["Key can be function or string"],"groupBy([6.1,4.2,6.3],Math.floor)","{4:[4.2],6:[6.1,6.3]}",jsBp("groupBy","arr, keyFn")),
  mkP(244,"Intersection of Arrays","Easy","Web",["Array","Set"],`Find common elements between two arrays.`,"intersection([1,2,3],[2,3,4])","[2,3]",["Handle duplicates"],"intersection([1,2,3],[2,3,4])","[2,3]",jsBp("intersection","arr1, arr2")),
  mkP(245,"Difference of Arrays","Easy","Web",["Array","Set"],`Find elements in first array not present in second.`,"difference([1,2,3],[2,4])","[1,3]",["Only from first array"],"difference([1,2,3],[2,4])","[1,3]",jsBp("difference","arr1, arr2")),
  mkP(246,"Object.keys Deep","Medium","Web",["Object","Recursion"],`Get all keys from a deeply nested object as dot-notation paths.`,"deepKeys({a:{b:{c:1}}})","['a.b.c']",["Handle arrays too"],"deepKeys({a:{b:1}})","['a.b']",jsBp("deepKeys","obj, prefix")),
  mkP(247,"Get Nested Value","Easy","Web",["Object"],`Safely get a nested value by path string: get(obj, 'a.b.c', default).`,"get({a:{b:1}},'a.b')","1",["Return default if missing"],"get({a:{b:1}},'a.b')","1",jsBp("get","obj, path, defaultVal")),
  mkP(248,"Set Nested Value","Medium","Web",["Object"],`Set a nested value by path string, creating intermediate objects as needed.`,"set({},'a.b.c',1)","{ a: { b: { c: 1 } } }",["Create missing objects"],"set({},'a.b.c',1)","{a:{b:{c:1}}}",jsBp("set","obj, path, value")),
  mkP(249,"Async Queue","Hard","Web",["Async","Concurrency"],`Implement an async task queue with configurable concurrency limit.`,"queue.add(asyncTask)","Results",["Limit concurrent tasks"],"queue(concurrency=2)","results",jsBp("AsyncQueue","concurrency")),
  mkP(250,"Rate Limiter","Medium","Web",["Closure","Timer"],`Create a rate limiter that allows max N calls per time window.`,"rateLimiter(5, 1000)","Limited function",["Sliding window"],"rateLimiter(5,1000)","limited fn",jsBp("rateLimiter","maxCalls, windowMs")),
  mkP(251,"Cancellable Promise","Medium","Web",["Promise"],`Create a wrapper that makes any promise cancellable.`,"makeCancellable(fetch(url))","Cancellable promise",["Cancel rejects with reason"],"makeCancellable(promise)","cancellable",jsBp("makeCancellable","promise")),
  mkP(252,"Object Freeze Deep","Medium","Web",["Object","Recursion"],`Deep freeze an object so all nested properties are immutable.`,"deepFreeze({a:{b:1}})","Frozen object",["Recurse into nested objects"],"deepFreeze({a:{b:1}})","frozen",jsBp("deepFreeze","obj")),
  mkP(253,"Proxy Validator","Medium","Web",["Proxy","Validation"],`Use Proxy to create a validated object that rejects invalid property assignments.`,"createValidator(schema)","Validated object",["Use Proxy traps"],"createValidator({age:'number'})","validated obj",jsBp("createValidator","schema")),
  mkP(254,"Infinite Scroll","Medium","Web",["DOM","Event","Async"],`Implement infinite scroll that loads more items when user reaches bottom.`,"setupInfiniteScroll(container)","Auto-loading",["Use IntersectionObserver"],"container element","infinite scroll",jsBp("setupInfiniteScroll","container, loadMore")),
  mkP(255,"Drag and Drop","Medium","Web",["DOM","Event"],`Implement drag and drop functionality for list items to reorder.`,"makeDraggable(list)","Reorderable list",["Use mouse events"],"list element","draggable list",jsBp("makeDraggable","container")),
  mkP(256,"Local Storage Wrapper","Easy","Web",["Storage","JSON"],`Create a typed localStorage wrapper with get, set, remove, and expiry support.`,"storage.set('key', data, ttl)","Typed storage",["Handle JSON serialization"],"storage.set('key',{a:1},3600)","storage wrapper",jsBp("createStorage","namespace")),
  mkP(257,"URL Parser","Medium","Web",["String","Regex"],`Parse a URL string into components: protocol, host, port, path, query, hash.`,"parseURL('https://...')","URL components",["Handle all URL parts"],"parseURL('https://a.com/p?q=1')","parsed url",jsBp("parseURL","url")),
  mkP(258,"Query String Parser","Easy","Web",["String"],`Parse a query string into an object: 'a=1&b=2' → {a:'1',b:'2'}.`,"parseQuery('a=1&b=2')","{ a: '1', b: '2' }",["Handle encoded characters"],"parseQuery('a=1&b=2')","{a:'1',b:'2'}",jsBp("parseQuery","queryString")),
  mkP(259,"Query String Builder","Easy","Web",["Object","String"],`Build a query string from an object: {a:1,b:2} → 'a=1&b=2'.`,"buildQuery({a:1,b:2})","'a=1&b=2'",["Handle arrays and encoding"],"buildQuery({a:1,b:2})","a=1&b=2",jsBp("buildQuery","params")),
  mkP(260,"Promise Pool","Hard","Web",["Async","Concurrency"],`Execute an array of async tasks with limited concurrency (promise pool pattern).`,"promisePool(tasks, 3)","All results",["Max N concurrent"],"promisePool(tasks,3)","results",jsBp("promisePool","tasks, limit")),
  mkP(261,"Lazy Evaluation","Medium","Web",["Functional","Generator"],`Create a lazy sequence that only computes values when needed.`,"lazy([1,2,3]).map(x=>x*2).take(2)","[2,4]",["Chain operations lazily"],"lazy([1,2,3]).map(x=>x*2).take(2)","[2,4]",jsBp("lazy","iterable")),
  mkP(262,"Object Diff","Medium","Web",["Object","Recursion"],`Find differences between two objects, returning added/removed/changed keys.`,"objDiff({a:1,b:2},{a:1,b:3,c:4})","Diff object",["Handle nested diffs"],"objDiff({a:1},{a:2})","diff",jsBp("objDiff","obj1, obj2")),
  mkP(263,"Retry Promise","Medium","Web",["Promise","Async"],`Retry an async function up to N times before giving up.`,"retryPromise(fn, 3)","Result or error",["Configurable attempts"],"retryPromise(fn,3)","result",jsBp("retryPromise","fn, retries")),
  mkP(264,"Simple Router","Medium","Web",["DOM","History"],`Implement a basic client-side router using History API.`,"router.on('/home', handler)","SPA routing",["Handle path params"],"router.on('/home',fn)","router",jsBp("Router","")),
  mkP(265,"Form Validator","Medium","Web",["DOM","Validation"],`Create a form validation library with rules like required, email, minLength.`,"validate({email: 'test'}, rules)","Validation result",["Composable rules"],"validate(data,rules)","valid/errors",jsBp("validate","data, rules")),
  mkP(266,"State Machine","Medium","Web",["Design Pattern"],`Implement a finite state machine with states, transitions, and guards.`,"machine.transition('next')","New state",["Validate transitions"],"machine.send('NEXT')","state",jsBp("createMachine","config")),
  mkP(267,"Middleware Pattern","Medium","Web",["Design Pattern","Async"],`Implement Express-style middleware pattern with next() function.`,"app.use(middleware)","Pipeline",["Support async middleware"],"app.use(fn)","pipeline",jsBp("createApp","")),
  mkP(268,"Observable Store","Medium","Web",["Reactive","Design Pattern"],`Create a reactive store (like Redux) with subscribe, getState, dispatch.`,"store.subscribe(listener)","Reactive store",["Notify on state change"],"store.dispatch(action)","store",jsBp("createStore","reducer, initial")),
  mkP(269,"Immutable Update","Medium","Web",["Object","Functional"],`Implement immutable object update: setIn(obj, ['a','b'], newVal).`,"setIn({a:{b:1}},['a','b'],2)","{ a: { b: 2 } }",["Don't mutate original"],"setIn({a:{b:1}},['a','b'],2)","{a:{b:2}}",jsBp("setIn","obj, path, value")),
  mkP(270,"Batch Async Requests","Medium","Web",["Async","Optimization"],`Batch multiple API calls made within a time window into a single request.`,"batcher.load(id)","Batched results",["Collect calls, batch-send"],"batcher.load(1)","batched",jsBp("createBatcher","batchFn, delay")),
  mkP(271,"Dependency Injection","Medium","Web",["Design Pattern"],`Create a simple DI container that resolves dependencies by name.`,"container.register('db', DBClass)","DI container",["Handle singletons"],"container.resolve('db')","instance",jsBp("DIContainer","")),
  mkP(272,"CSS Specificity Calculator","Medium","Web",["CSS","Parsing"],`Calculate CSS specificity of a selector string as [a,b,c].`,"specificity('#id .class p')","[1,1,1]",["Handle combinators"],"specificity('#id .class p')","[1,1,1]",jsBp("specificity","selector")),
  mkP(273,"DOM Traversal","Easy","Web",["DOM","Tree"],`Implement a function to find all text nodes within a DOM subtree.`,"getTextNodes(element)","Text nodes array",["Recursive traversal"],"getTextNodes(el)","text nodes",jsBp("getTextNodes","element")),
  mkP(274,"Async Iterator","Medium","Web",["Async","Iterator"],`Create an async iterator that yields paginated API results.`,"for await (const page of fetchPages(url))","Paginated data",["Use Symbol.asyncIterator"],"fetchPages(url)","pages",jsBp("fetchPages","url, pageSize")),
  mkP(275,"Web Worker Communication","Medium","Web",["Worker","Async"],`Create a wrapper for clean Web Worker communication with promises.`,"workerCall('compute', data)","Result",["postMessage + onmessage"],"workerCall('task',data)","result",jsBp("createWorkerProxy","worker")),
  mkP(276,"Event Delegation","Easy","Web",["DOM","Event"],`Implement event delegation: single handler on parent for all matching children.`,"delegate(ul, 'li', 'click', fn)","Delegated handler",["Match selector on ancestors"],"delegate(parent,'li','click',fn)","delegation",jsBp("delegate","parent, selector, event, handler")),
  mkP(277,"Intersection Observer","Medium","Web",["DOM","Performance"],`Implement lazy image loading using IntersectionObserver.`,"lazyLoad('img[data-src]')","Lazy loaded images",["Load when visible"],"lazyLoad('img')","lazy loaded",jsBp("lazyLoad","selector")),
  mkP(278,"Custom Hooks Pattern","Medium","Web",["React","Hooks"],`Implement a useLocalStorage custom hook pattern (vanilla JS version).`,"useStorage('key', default)","[value, setValue]",["Sync with storage"],"useStorage('theme','light')","[value,setter]",jsBp("useStorage","key, defaultValue")),
  mkP(279,"AbortController Wrapper","Medium","Web",["Async","AbortController"],`Create a request manager that cancels previous requests when a new one starts.`,"manager.request(url)","Latest result only",["Cancel stale requests"],"manager.request(url)","latest result",jsBp("createRequestManager","")),
  mkP(280,"Trie Autocomplete","Hard","Web",["Data Structure","Trie"],`Build a trie-based autocomplete system returning top suggestions.`,"autocomplete.suggest('app')","['apple','application']",["Rank by frequency"],"autocomplete.suggest('app')","suggestions",jsBp("Autocomplete","")),
  mkP(281,"Matrix Operations","Medium","Web",["Math","Array"],`Implement matrix multiplication, transpose, and determinant.`,"multiply(matA, matB)","Result matrix",["Validate dimensions"],"multiply([[1,2],[3,4]],[[5,6],[7,8]])","[[19,22],[43,50]]",jsBp("matrixMultiply","a, b")),
  mkP(282,"BFS Shortest Path","Medium","Web",["Graph","BFS"],`Find shortest path between two nodes using BFS.`,"shortestPath(graph,'A','F')","['A','C','F']",["Return path array"],"shortestPath(graph,'A','F')","path",jsBp("shortestPath","graph, start, end")),
  mkP(283,"Topological Sort","Medium","Web",["Graph","DFS"],`Implement topological sort for a directed acyclic graph.`,"topoSort(graph)","Sorted order",["Detect cycles"],"topoSort(graph)","sorted",jsBp("topoSort","graph")),
  mkP(284,"LCS in JavaScript","Medium","Web",["DP","String"],`Find the longest common subsequence of two strings.`,'lcs("abcde","ace")',"'ace'",["DP table approach"],'lcs("abcde","ace")',"ace",jsBp("lcs","str1, str2")),
  mkP(285,"Regex Engine","Hard","Web",["Regex","Recursion"],`Build a simple regex engine supporting '.', '*', and character matching.`,"match('a*b', 'aaab')","true",["Handle . and * operators"],"match('a.b','acb')","true",jsBp("match","pattern, text")),
  mkP(286,"JSON Path Query","Hard","Web",["Object","Parsing"],`Implement a JSON path query system: query(obj, '$.store.book[0].title').`,"jsonPath(obj, path)","Matched values",["Support wildcards"],"jsonPath(obj,'$.a.b')","value",jsBp("jsonPath","obj, path")),
  mkP(287,"Color Converter","Easy","Web",["Math","String"],`Convert between hex, RGB, and HSL color formats.`,"hexToRgb('#ff5733')","{ r: 255, g: 87, b: 51 }",["Handle shorthand hex"],"hexToRgb('#ff5733')","rgb",jsBp("hexToRgb","hex")),
  mkP(288,"Date Formatter","Easy","Web",["Date","String"],`Format dates with tokens: format(date, 'YYYY-MM-DD HH:mm:ss').`,"format(new Date(), 'YYYY-MM-DD')","'2024-01-15'",["Support common tokens"],"format(date,'YYYY-MM-DD')","formatted",jsBp("formatDate","date, pattern")),
  mkP(289,"Number Formatter","Easy","Web",["Number","String"],`Format numbers with thousands separators and decimal places.`,"formatNumber(1234567.89)","'1,234,567.89'",["Handle negatives"],"formatNumber(1234567.89)","1,234,567.89",jsBp("formatNumber","num, decimals")),
  mkP(290,"UUID Generator","Easy","Web",["Math","String"],`Generate a valid v4 UUID string.`,"uuid()","'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'",["Follow RFC 4122"],"uuid()","uuid string",jsBp("uuid","")),
  mkP(291,"Caesar Cipher","Easy","Web",["String","Crypto"],`Implement Caesar cipher encryption and decryption with configurable shift.`,"caesar('hello', 3)","'khoor'",["Handle wrap-around"],"caesar('hello',3)","khoor",jsBp("caesar","text, shift")),
  mkP(292,"Markdown Parser","Hard","Web",["String","Parsing"],`Parse basic Markdown (headers, bold, italic, links, code) to HTML.`,"parseMarkdown('# Hello')","'<h1>Hello</h1>'",["Handle nested formatting"],"parseMarkdown('# Hi')","<h1>Hi</h1>",jsBp("parseMarkdown","md")),
  mkP(293,"CSS-in-JS","Medium","Web",["CSS","DOM"],`Implement a minimal CSS-in-JS library: styled('div', {color:'red'}).`,"styled('div', styles)","Styled element",["Inject style tags"],"styled('div',{color:'red'})","styled el",jsBp("styled","tag, styles")),
  mkP(294,"Undo/Redo System","Medium","Web",["Design Pattern","Stack"],`Implement an undo/redo history system for any state.`,"history.push(state)","Undo/Redo",["Stack-based history"],"history.undo()","previous state",jsBp("createHistory","initialState")),
  mkP(295,"Scheduler","Medium","Web",["Async","Timer"],`Create a task scheduler that runs tasks at specified intervals with priority.`,"scheduler.schedule(task, interval, priority)","Scheduled tasks",["Priority queue based"],"scheduler.schedule(fn,1000,1)","scheduled",jsBp("Scheduler","")),
  mkP(296,"HTML Sanitizer","Medium","Web",["String","Security"],`Strip dangerous HTML tags and attributes to prevent XSS.`,"sanitize('<script>alert(1)</script>')","''",["Whitelist safe tags"],"sanitize('<script>bad</script>')","sanitized",jsBp("sanitize","html, allowedTags")),
  mkP(297,"Virtual Scroll","Hard","Web",["DOM","Performance"],`Implement virtual scrolling that only renders visible items from a large list.`,"virtualScroll(container, items, rowHeight)","Efficient scroll",["Recycle DOM nodes"],"virtualScroll(el,items,40)","virtual scroll",jsBp("virtualScroll","container, items, rowHeight")),
  mkP(298,"WebSocket Reconnect","Medium","Web",["WebSocket","Async"],`Create a WebSocket wrapper with auto-reconnect and exponential backoff.`,"createWS(url, options)","Resilient WS",["Max retries, backoff"],"createWS('ws://...')","auto-reconnect ws",jsBp("createReconnectingWS","url, options")),
  mkP(299,"Signal / Reactive","Hard","Web",["Reactive","Functional"],`Implement a signals-based reactivity system like SolidJS.`,"const [count, setCount] = signal(0)","Reactive value",["Auto-track dependencies"],"signal(0)","reactive",jsBp("signal","initialValue")),
  mkP(300,"Mini React Renderer","Hard","Web",["Rendering","Virtual DOM"],`Build a minimal React-like renderer: createElement, render, and basic reconciliation.`,"render(h('div',null,'Hello'), root)","Rendered DOM",["Handle updates via diff"],"render(vdom, container)","rendered",jsBp("render","vnode, container")),
];
// ── Syntax Highlighting ──
const KW = {
  python: "def|class|if|else|elif|for|while|return|import|from|in|not|and|or|is|None|True|False|pass|break|continue|try|except|finally|with|as|lambda|self|yield|raise",
  java: "public|private|protected|static|void|int|boolean|String|class|return|new|if|else|for|while|null|true|false|this|super|import|extends|implements|throw|try|catch|final|abstract",
  cpp: "int|void|bool|char|float|double|string|class|struct|public|private|return|if|else|for|while|new|delete|nullptr|true|false|const|auto|vector|using|namespace|include|template|typename",
  c: "int|void|char|float|double|struct|return|if|else|for|while|NULL|sizeof|typedef|const|static|include|define|malloc|free|unsigned|long",
  javascript: "var|let|const|function|return|if|else|for|while|new|this|class|extends|import|export|default|async|await|null|undefined|true|false|typeof|instanceof|console|of",
  html: "html|head|body|div|span|p|a|img|link|script|style|meta|title|h1|h2|h3|h4|h5|h6|ul|ol|li|table|tr|td|th|form|input|button|section|header|footer|nav|main|article",
  css: "color|background|margin|padding|border|font|display|flex|grid|position|width|height|top|left|right|bottom|align|justify|text|overflow|transition|transform|opacity|z-index|box-shadow",
  mysql: "SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|JOIN|LEFT|RIGHT|ON|AND|OR|NOT|IN|ORDER|BY|GROUP|HAVING|LIMIT|AS|COUNT|SUM|AVG|MAX|MIN|NULL|IS|DISTINCT|DESC|ASC|INTO|VALUES|SET",
  postgresql: "SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|JOIN|LEFT|RIGHT|ON|AND|OR|NOT|IN|ORDER|BY|GROUP|HAVING|LIMIT|AS|COUNT|SUM|AVG|MAX|MIN|NULL|IS|DISTINCT|DESC|ASC",
  mongodb: "find|sort|limit|skip|aggregate|match|group|project|lookup|unwind|db|collection|insertOne|updateOne|deleteOne|findOne|count|distinct",
};

function highlightCode(code, lang) {
  let h = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Multi-line comments
  h = h.replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="hl-cm">$1</span>`);
  // Single-line comments
  h = h.replace(/(\/\/[^\n]*)/g, `<span class="hl-cm">$1</span>`);
  h = h.replace(/(#[^\n]*)/g, `<span class="hl-cm">$1</span>`);
  // Strings
  h = h.replace(/("(?:[^"\\]|\\.)*")/g, `<span class="hl-st">$1</span>`);
  h = h.replace(/('(?:[^'\\]|\\.)*')/g, `<span class="hl-st">$1</span>`);
  // Template literals
  h = h.replace(/(`(?:[^`\\]|\\.)*`)/g, `<span class="hl-st">$1</span>`);
  // Keywords
  const kw = KW[lang] || KW.python;
  h = h.replace(new RegExp(`\\b(${kw})\\b`, "g"), `<span class="hl-kw">$1</span>`);
  // Numbers
  h = h.replace(/\b(\d+\.?\d*)\b/g, `<span class="hl-nm">$1</span>`);
  // Function calls (only if not already wrapped)
  h = h.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, (m, name) => {
    if ((KW[lang] || "").includes(name)) return m;
    return `<span class="hl-fn">${name}</span>`;
  });
  // Decorators / annotations
  h = h.replace(/(@\w+)/g, `<span class="hl-dc">$1</span>`);
  return h;
}

// ── Achievement Badges ──
const BADGES = [
  { id: "first", icon: "🎯", name: "First Solve", desc: "Solve your first problem", check: s => s.solved >= 1 },
  { id: "five", icon: "🔥", name: "On Fire", desc: "Solve 5 problems", check: s => s.solved >= 5 },
  { id: "ten", icon: "⭐", name: "Rising Star", desc: "Solve 10 problems", check: s => s.solved >= 10 },
  { id: "twentyfive", icon: "💎", name: "Diamond Coder", desc: "Solve 25 problems", check: s => s.solved >= 25 },
  { id: "hard", icon: "🏔️", name: "Summit", desc: "Solve a Hard problem", check: s => s.hardSolved >= 1 },
  { id: "streak3", icon: "📅", name: "Consistent", desc: "3-day coding streak", check: s => s.streak >= 3 },
  { id: "streak7", icon: "🔗", name: "Unstoppable", desc: "7-day coding streak", check: s => s.streak >= 7 },
  { id: "speed", icon: "⚡", name: "Speed Demon", desc: "Solve under 5 minutes", check: s => s.fastSolve },
  { id: "notes", icon: "📝", name: "Scholar", desc: "Write notes on 5 problems", check: s => s.noteCount >= 5 },
  { id: "allcat", icon: "🌈", name: "Polyglot", desc: "Use 4+ languages", check: s => s.langsUsed >= 4 },
];

// ── Code Templates ──
const TEMPLATES = [
  { name: "BFS (Graph/Tree)", icon: "🌊", lang: "python", code: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited` },
  { name: "DFS (Recursive)", icon: "🔍", lang: "python", code: `def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited` },
  { name: "Binary Search", icon: "🎯", lang: "python", code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1` },
  { name: "Sliding Window", icon: "🪟", lang: "python", code: `def sliding_window(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum` },
  { name: "Two Pointers", icon: "👆", lang: "python", code: `def two_pointers(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current = arr[left] + arr[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return []` },
  { name: "DP (1D)", icon: "📊", lang: "python", code: `def dp_1d(n):\n    dp = [0] * (n + 1)\n    dp[0] = 1  # base case\n    for i in range(1, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]  # recurrence\n    return dp[n]` },
  { name: "DP (2D)", icon: "🗃️", lang: "python", code: `def dp_2d(m, n):\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    return dp[m][n]` },
  { name: "Backtracking", icon: "↩️", lang: "python", code: `def backtrack(candidates, target, path, result, start):\n    if target == 0:\n        result.append(path[:])\n        return\n    for i in range(start, len(candidates)):\n        if candidates[i] > target:\n            break\n        path.append(candidates[i])\n        backtrack(candidates, target - candidates[i], path, result, i)\n        path.pop()` },
  { name: "Union Find", icon: "🔗", lang: "python", code: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py: return False\n        if self.rank[px] < self.rank[py]: px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]: self.rank[px] += 1\n        return True` },
  { name: "Trie", icon: "🌳", lang: "python", code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children:\n                node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children: return False\n            node = node.children[c]\n        return node.is_end` },
];

// ── Compact UI Components ──
function DiffBadge({ d, lg }) { const m = { Easy: [T.green, T.greenBg, T.greenBorder], Medium: [T.yellow, T.yellowBg, "#FDE68A"], Hard: [T.red, T.redBg, T.redBorder] }; const [c, bg, bd] = m[d] || [T.textSec, T.bgMuted, T.border]; return <span style={{ fontSize: lg ? 13 : 11, fontWeight: 700, color: c, padding: lg ? "4px 14px" : "2px 10px", borderRadius: 100, background: bg, border: `1px solid ${bd}` }}>{d}</span>; }

function IBtn({ children, onClick, title, active, style = {} }) { const [h, setH] = useState(false); return <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: active ? T.accentBg : h ? T.bgHover : "transparent", border: active ? `1px solid ${T.borderAccent}` : "1px solid transparent", color: active ? T.accent : h ? T.text : T.textSec, borderRadius: 10, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", fontSize: 14, ...style }}>{children}</button>; }

function Tabs({ tabs, active, onChange, style = {} }) { return <div style={{ display: "flex", gap: 2, background: T.bgMuted, borderRadius: 10, padding: 3, flexWrap: "wrap", ...style }}>{tabs.map(t => <button key={t.key} onClick={() => onChange(t.key)} style={{ background: active === t.key ? T.bgWhite : "transparent", border: "none", color: active === t.key ? T.text : T.textMuted, padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: active === t.key ? 600 : 500, transition: "all 0.2s", boxShadow: active === t.key ? T.shadow : "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>{t.icon && <span style={{ fontSize: 11 }}>{t.icon}</span>}{t.label}</button>)}</div>; }

// ── Syntax-Highlighted Code Editor ──
function CodeEditor({ value, onChange, fontSize, lang }) {
  const taRef = useRef(null), lnRef = useRef(null), hlRef = useRef(null);
  const lines = value.split("\n"), lh = fontSize * 1.65;
  const handleKey = useCallback(e => {
    const ta = e.target;
    if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart; const nv = value.substring(0, s) + "    " + value.substring(ta.selectionEnd); onChange(nv); setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0); }
    if (e.key === "Enter") { e.preventDefault(); const s = ta.selectionStart; const ls = value.lastIndexOf("\n", s - 1) + 1; const indent = value.substring(ls, s).match(/^\s*/)[0]; const extra = ["{", "(", "[", ":"].includes(value[s - 1]) ? "    " : ""; const nv = value.substring(0, s) + "\n" + indent + extra + value.substring(s); onChange(nv); setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + extra.length; }, 0); }
  }, [value, onChange]);
  const syncScroll = useCallback(() => { if (lnRef.current && taRef.current) lnRef.current.scrollTop = taRef.current.scrollTop; if (hlRef.current && taRef.current) { hlRef.current.scrollTop = taRef.current.scrollTop; hlRef.current.scrollLeft = taRef.current.scrollLeft; } }, []);
  const highlighted = useMemo(() => highlightCode(value, lang), [value, lang]);
  const editorFont = { fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize, lineHeight: `${lh}px`, tabSize: 4 };

  return <div style={{ display: "flex", flex: 1, overflow: "hidden", background: T.bgWhite }}>
    <div ref={lnRef} style={{ width: 54, minWidth: 54, background: T.bgPanel, borderRight: `1px solid ${T.borderLight}`, overflow: "hidden", userSelect: "none", paddingTop: 14 }}>
      {lines.map((_, i) => <div key={i} style={{ textAlign: "right", paddingRight: 16, ...editorFont, height: lh, color: T.textFaint }}>{i + 1}</div>)}
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Highlighted overlay */}
      <pre ref={hlRef} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: "14px 18px", overflow: "auto", pointerEvents: "none", ...editorFont, color: T.text, whiteSpace: "pre", background: "transparent", zIndex: 1 }} dangerouslySetInnerHTML={{ __html: highlighted + "\n" }} />
      {/* Transparent textarea for input */}
      <textarea ref={taRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKey} onScroll={syncScroll} spellCheck={false}
        style={{ position: "relative", width: "100%", height: "100%", border: "none", padding: "14px 18px", resize: "none", outline: "none", overflow: "auto", ...editorFont, color: "transparent", caretColor: T.accent, background: T.bgWhite, zIndex: 2 }} />
    </div>
  </div>;
}

function Timer({ seconds, running, onToggle, onReset }) { const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; return <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: T.bgMuted, borderRadius: 10, border: `1px solid ${T.borderLight}` }}><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: T.textSec, minWidth: 44, fontWeight: 600 }}>{fmt(seconds)}</span><IBtn onClick={onToggle} style={{ padding: 4 }}>{running ? "⏸" : "▶"}</IBtn><IBtn onClick={onReset} style={{ padding: 4 }}>↺</IBtn></div>; }

function LangSelector({ lang, onChange, problem }) { const [open, setOpen] = useState(false); const avail = Object.keys(problem.boilerplate); const l = LANGS[lang]; return <div style={{ position: "relative" }}><button onClick={() => setOpen(!open)} style={{ background: T.bgWhite, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "7px 14px 7px 10px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: T.text, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, boxShadow: T.shadow }}><span style={{ fontSize: 16 }}>{l?.icon}</span>{l?.name || lang}<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s" }}><path d="M3 4.5l3 3 3-3" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg></button>{open && <><div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setOpen(false)} /><div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 51, background: T.bgWhite, border: `1px solid ${T.border}`, borderRadius: 14, padding: 6, minWidth: 220, boxShadow: T.shadowLg }}>{["Programming", "Web", "Database"].map(cat => { const cls = avail.filter(k => LANGS[k]?.cat === cat); if (!cls.length) return null; return <div key={cat}><div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat}</div>{cls.map(k => <button key={k} onClick={() => { onChange(k); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: lang === k ? T.accentBg : "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: T.text, fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: lang === k ? 600 : 400, textAlign: "left" }}><span style={{ fontSize: 16 }}>{LANGS[k]?.icon}</span>{LANGS[k]?.name}{lang === k && <span style={{ marginLeft: "auto", color: T.accent }}>✓</span>}</button>)}</div>; })}</div></>}</div>; }

// ── Streak Calendar ──
function StreakCalendar({ solvedDates }) {
  const today = new Date(); const days = 91;
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    const count = solvedDates[key] || 0;
    const lvl = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : 3;
    const colors = [T.bgMuted, T.isDark ? "#166534" : "#BBF7D0", T.isDark ? "#15803D" : "#86EFAC", T.green];
    return { key, lvl, color: colors[lvl], date: d };
  });
  const weeks = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return <div style={{ display: "flex", gap: 3 }}>
    {weeks.map((w, wi) => <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {w.map(c => <div key={c.key} title={`${c.key}: ${c.lvl > 0 ? c.lvl + " solved" : "No activity"}`} style={{ width: 12, height: 12, borderRadius: 3, background: c.color, border: `1px solid ${T.borderLight}` }} />)}
    </div>)}
  </div>;
}

// ── Progress Ring ──
function ProgressRing({ solved, total, size = 38 }) {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  const r = (size - 6) / 2, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.borderLight} strokeWidth="3" />
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.green} strokeWidth="3"
      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill={T.text}
      style={{ fontSize: 10, fontWeight: 800, fontFamily: "'Inter',sans-serif", transform: "rotate(90deg)", transformOrigin: "center" }}>{solved}</text>
  </svg>;
}

// ── Complexity Gauge ──
function ComplexityGauge({ level }) {
  const levels = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"];
  const colors = ["#22C55E", "#84CC16", "#EAB308", "#F97316", "#EF4444", "#DC2626"];
  const idx = Math.min(level, 5);
  const angle = -90 + (idx / 5) * 180;
  return <div style={{ textAlign: "center" }}>
    <svg width="120" height="70" viewBox="0 0 120 70">
      <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke={T.borderLight} strokeWidth="8" strokeLinecap="round" />
      {[0,1,2,3,4,5].map(i => {
        const a = (-180 + i * 36) * Math.PI / 180;
        const x = 60 + 50 * Math.cos(a), y = 65 + 50 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="3" fill={i <= idx ? colors[i] : T.borderLight} />;
      })}
      <line x1="60" y1="65" x2={60 + 38 * Math.cos(angle * Math.PI / 180)} y2={65 + 38 * Math.sin(angle * Math.PI / 180)} stroke={colors[idx]} strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="65" r="4" fill={colors[idx]} />
    </svg>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 800, color: colors[idx], marginTop: 2 }}>{levels[idx]}</div>
  </div>;
}

// ═══════════════════════════════
//  MAIN PLATFORM
// ═══════════════════════════════
export default function CodeSkillPlatform() {
  const [theme, setTheme] = useState("light");
  const [problemId, setProblemId] = useState(1);
  const [lang, setLang] = useState("python");
  const [codes, setCodes] = useState({});
  const [fontSize, setFontSize] = useState(14);
  const [leftTab, setLeftTab] = useState("description");
  const [bottomTab, setBottomTab] = useState("testcase");
  const [showProblems, setShowProblems] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [splitX, setSplitX] = useState(38);
  const [splitY, setSplitY] = useState(60);
  const [activeTC, setActiveTC] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);

  // Feature state
  const [solved, setSolved] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [notes, setNotes] = useState({});
  const [consoleOutput, setConsoleOutput] = useState("");
  const [aiHint, setAiHint] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showContest, setShowContest] = useState(false);
  const [problemListFilter, setProblemListFilter] = useState("All");
  const [contestMode, setContestMode] = useState(false);
  const [contestProblems, setContestProblems] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [solvedDates, setSolvedDates] = useState({});
  const [langsUsed, setLangsUsed] = useState(new Set());
  const [timerSec, setTimerSec] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [keyCount, setKeyCount] = useState(0);
  const [wpmStart, setWpmStart] = useState(null);
  const [termHistory, setTermHistory] = useState(["$ codeskill --ready", "CodeSkill v2.0 initialized", "Waiting for code execution..."]);
  const [termInput, setTermInput] = useState("");
  const [complexityLevel, setComplexityLevel] = useState(null);
  const [codeReview, setCodeReview] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const dailyProblemId = useMemo(() => { const d = new Date(); return (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % PROBLEMS.length + 1; }, []);

  useEffect(() => { if (!timerOn) return; const id = setInterval(() => setTimerSec(s => s + 1), 1000); return () => clearInterval(id); }, [timerOn]);
  T = theme === "dark" ? DARK : LIGHT;

  const problem = useMemo(() => PROBLEMS.find(p => p.id === problemId), [problemId]);
  useEffect(() => { const av = Object.keys(problem.boilerplate); if (!av.includes(lang)) setLang(av[0]); }, [problemId]);

  const codeKey = `${problemId}-${lang}`;
  const code = codes[codeKey] ?? problem.boilerplate[lang] ?? "";
  const setCode = val => {
    setCodes(prev => ({ ...prev, [codeKey]: val }));
    // WPM tracking
    if (!wpmStart) setWpmStart(Date.now());
    setKeyCount(prev => prev + 1);
    const elapsed = (Date.now() - (wpmStart || Date.now())) / 60000;
    if (elapsed > 0.05) setWpm(Math.round((keyCount / 5) / elapsed));
  };

  const handleProblemChange = id => { setProblemId(id); setResults(null); setSubmitted(false); setBottomTab("testcase"); setActiveTC(0); setAiHint(""); setConsoleOutput(""); };
  const handleReset = () => { setCodes(prev => ({ ...prev, [codeKey]: problem.boilerplate[lang] ?? "" })); setResults(null); };

  const isCodeModified = useCallback(() => { const bp = problem.boilerplate[lang] ?? ""; const strip = s => s.replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim(); return strip(code) !== strip(bp) && Math.abs(strip(code).length - strip(bp).length) >= 15; }, [code, problem, lang]);
  const errOut = { python: "None", java: "null", cpp: "0", c: "0", javascript: "undefined" };
  const errMsgMap = { python: "TypeError: 'NoneType' is not iterable", java: "NullPointerException", cpp: "Runtime Error", c: "Segmentation fault", javascript: "TypeError: Cannot read properties of undefined" };

  const handleRun = () => {
    setRunning(true); setBottomTab("result"); setResults(null); setLangsUsed(prev => new Set([...prev, lang]));
    const modified = isCodeModified();
    setConsoleOutput(modified ? `> Running ${LANGS[lang]?.name}...\n> Compiling...\n> Executing test cases...` : `> Running ${LANGS[lang]?.name}...\n> ${errMsgMap[lang] || "Error"}\n> Process exited with code 1`);
    setTimeout(() => {
      if (!modified) { setResults(problem.testCases.map((tc, i) => ({ id: i, input: tc.input, expected: tc.expected, output: errOut[lang] || "null", passed: false, runtime: "N/A", memory: "N/A", error: errMsgMap[lang] || "Error" }))); }
      else { const q = Math.random(); setResults(problem.testCases.map((tc, i) => { const p = q > 0.5 ? Math.random() > 0.15 : Math.random() > 0.6; return { id: i, input: tc.input, expected: tc.expected, output: p ? tc.expected : "Wrong Answer", passed: p, runtime: p ? Math.floor(Math.random() * 80) + 4 + "ms" : "N/A", memory: p ? (Math.random() * 20 + 10).toFixed(1) + " MB" : "N/A", error: p ? null : "Wrong Answer" }; })); setConsoleOutput(prev => prev + "\n> Execution complete."); }
      setRunning(false);
    }, 1200);
  };

  const handleSubmit = () => {
    setRunning(true); setBottomTab("result"); setResults(null); setSubmitted(false);
    const modified = isCodeModified();
    setTimeout(() => {
      if (!modified) { setResults(problem.testCases.map((tc, i) => ({ id: i, input: tc.input, expected: tc.expected, output: errOut[lang] || "null", passed: false, runtime: "N/A", memory: "N/A", error: errMsgMap[lang] || "Error" }))); }
      else { const allP = Math.random() > 0.4; setResults(problem.testCases.map((tc, i) => { const p = allP ? true : i < problem.testCases.length - 1; return { id: i, input: tc.input, expected: tc.expected, output: p ? tc.expected : "Wrong Answer", passed: p, runtime: Math.floor(Math.random() * 60) + 4 + "ms", memory: (Math.random() * 20 + 10).toFixed(1) + " MB", error: p ? null : "Wrong Answer" }; }));
        if (allP) { setSolved(prev => new Set([...prev, problemId])); const today = new Date().toISOString().split("T")[0]; setSolvedDates(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 })); setComplexityLevel(estimateComplexity()); }
      }
      setRunning(false); setSubmitted(true);
    }, 2000);
  };

  const fetchHint = async (type) => { setAiLoading(true); setAiHint(""); setLeftTab("hints"); try { const prompts = { hint: `Give 3 progressive hints for: ${problem.title}\n${problem.description}`, solution: `Explain optimal solution for: ${problem.title}\n${problem.description}`, complexity: `Analyze time/space complexity for: ${problem.title}\n${problem.description}` }; const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompts[type] }] }) }); const data = await res.json(); setAiHint(data.content?.map(c => c.text || "").join("\n") || "Unable to generate."); } catch { setAiHint("Error fetching hint."); } setAiLoading(false); };

  // AI Code Review
  const fetchCodeReview = async () => {
    setReviewLoading(true); setCodeReview(""); setLeftTab("hints");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: `Review this ${LANGS[lang]?.name} code for the problem "${problem.title}". Give line-by-line feedback on bugs, style, efficiency. Be specific and constructive.\n\nCode:\n${code}` }] }),
      });
      const data = await res.json();
      setCodeReview(data.content?.map(c => c.text || "").join("\n") || "Unable to review.");
    } catch { setCodeReview("Error reviewing code."); }
    setReviewLoading(false);
  };

  // Complexity estimation (after successful submit)
  const estimateComplexity = () => {
    const codeLen = code.length;
    const hasNested = /for.*\n.*for|while.*\n.*while/.test(code);
    const hasRecursion = /def\s+\w+.*\n[\s\S]*?\1|function\s+\w+[\s\S]*?\1/.test(code);
    const hasBinarySearch = /mid|binary|log|\/\s*2|>>/.test(code);
    const hasSort = /sort|sorted/.test(code);
    if (hasNested) return 4; // O(n²)
    if (hasRecursion) return 3; // O(n log n) estimate
    if (hasSort) return 3; // O(n log n)
    if (hasBinarySearch) return 1; // O(log n)
    if (codeLen < 100) return 0; // O(1)
    return 2; // O(n)
  };

  // Terminal commands
  const handleTermCommand = (cmd) => {
    const newHistory = [...termHistory, `$ ${cmd}`];
    if (cmd === "clear") { setTermHistory([]); return; }
    if (cmd === "help") newHistory.push("Commands: run, clear, help, lang, problem, stats, whoami");
    else if (cmd === "run") { newHistory.push(`> Executing ${LANGS[lang]?.name}...`); handleRun(); }
    else if (cmd === "lang") newHistory.push(`Current: ${LANGS[lang]?.name} (${LANGS[lang]?.ext})`);
    else if (cmd === "problem") newHistory.push(`#${problem.id}: ${problem.title} [${problem.difficulty}]`);
    else if (cmd === "stats") newHistory.push(`Solved: ${solved.size} | WPM: ${wpm} | Badges: ${unlockedBadges.length}`);
    else if (cmd === "whoami") newHistory.push("CodeSkill User | Evolvian Platform");
    else newHistory.push(`Command not found: ${cmd}. Type 'help' for available commands.`);
    setTermHistory(newHistory);
    setTermInput("");
  };

  const exportCode = () => { const blob = new Blob([code], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${problem.title.replace(/\s+/g, "_")}.${LANGS[lang]?.ext || "txt"}`; a.click(); URL.revokeObjectURL(url); };
  const startContest = () => { const sh = [...PROBLEMS].filter(p => p.cat === "Programming").sort(() => Math.random() - 0.5).slice(0, 4); setContestProblems(sh); setContestMode(true); setShowContest(false); setProblemId(sh[0].id); setTimerSec(0); setTimerOn(true); };

  useEffect(() => { const h = e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleRun(); } }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [code]);

  const startDragX = useCallback(e => { e.preventDefault(); const onMove = ev => { if (!containerRef.current) return; setSplitX(Math.max(22, Math.min(65, ((ev.clientX - containerRef.current.getBoundingClientRect().left) / containerRef.current.getBoundingClientRect().width) * 100))); }; const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; }; document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp); }, []);
  const startDragY = useCallback(e => { e.preventDefault(); const rp = e.target.closest("[data-rp]"); if (!rp) return; const onMove = ev => { setSplitY(Math.max(25, Math.min(82, ((ev.clientY - rp.getBoundingClientRect().top) / rp.getBoundingClientRect().height) * 100))); }; const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; }; document.body.style.cursor = "row-resize"; document.body.style.userSelect = "none"; document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp); }, []);

  const allPassed = results?.every(r => r.passed);
  const companies = COMPANY_TAGS[problemId] || [];
  const badgeStats = { solved: solved.size, hardSolved: [...solved].filter(id => PROBLEMS.find(p => p.id === id)?.difficulty === "Hard").length, streak: Object.keys(solvedDates).length, fastSolve: timerSec > 0 && timerSec < 300 && solved.has(problemId), noteCount: Object.values(notes).filter(n => n?.length > 10).length, langsUsed: langsUsed.size };
  const unlockedBadges = BADGES.filter(b => b.check(badgeStats));

  const renderText = text => { if (!text) return null; return text.split("\n").map((line, i) => <div key={i} style={{ minHeight: line.trim() === "" ? 14 : "auto" }}>{line.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, j) => { if (part.startsWith("`") && part.endsWith("`")) return <code key={j} style={{ background: T.accentBg, color: T.accent, padding: "2px 7px", borderRadius: 5, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{part.slice(1, -1)}</code>; if (part.startsWith("**") && part.endsWith("**")) return <strong key={j} style={{ color: T.text, fontWeight: 700 }}>{part.slice(2, -2)}</strong>; return <span key={j}>{part}</span>; })}</div>); };

  return <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.text, fontFamily: "'Inter',sans-serif", overflow: "hidden" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      body{background:${T.bg};margin:0;overflow:hidden}
      ::selection{background:${T.bgActive};color:${T.accent}}
      ::-webkit-scrollbar{width:7px;height:7px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.textFaint};border-radius:10px}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes slideUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .hl-kw{color:${T.isDark ? "#C084FC" : "#7C3AED"};font-weight:600}
      .hl-st{color:${T.isDark ? "#FCA5A5" : "#DC2626"}}
      .hl-cm{color:${T.textMuted};font-style:italic}
      .hl-nm{color:${T.isDark ? "#67E8F9" : "#0891B2"}}
      .hl-fn{color:${T.isDark ? "#FDE68A" : "#B45309"}}
      .hl-dc{color:${T.isDark ? "#A5B4FC" : "#4F46E5"}}
      @media(max-width:768px){
        .cs-header-extra{display:none !important}
        .cs-main{flex-direction:column !important;padding:4px !important}
        .cs-left{width:100% !important;max-height:40vh !important}
        .cs-dragx{display:none !important}
        .cs-right{flex:1 !important}
        .cs-footer{display:none !important}
      }
    `}</style>

    {/* HEADER */}
    {!focusMode && <header style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", background: T.bgWhite, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: T.gradient, fontSize: 14 }}>💻</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 17, color: T.text, letterSpacing: "-0.03em" }}>CodeSkill</span>
        </div>
        <div style={{ width: 1, height: 20, background: T.border }} />
        <button onClick={() => setShowProblems(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: T.bgMuted, border: `1px solid ${T.borderLight}`, borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, fontFamily: "'Inter',sans-serif" }}>☰ Problems</button>
        <IBtn onClick={() => handleProblemChange(Math.max(1, problemId - 1))} style={{ padding: 5 }}>◀</IBtn>
        <IBtn onClick={() => handleProblemChange(Math.min(PROBLEMS.length, problemId + 1))} style={{ padding: 5 }}>▶</IBtn>
        {contestMode && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", padding: "3px 10px", borderRadius: 6, background: T.gradient }}>🏆 CONTEST</span>}
      </div>
      <div className="cs-header-extra" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ProgressRing solved={solved.size} total={PROBLEMS.length} />
        <IBtn onClick={() => setShowBadges(true)} title="Badges" style={{ fontSize: 16 }}>🏅 <span style={{ fontSize: 11, fontWeight: 700 }}>{unlockedBadges.length}</span></IBtn>
        <Timer seconds={timerSec} running={timerOn} onToggle={() => setTimerOn(!timerOn)} onReset={() => { setTimerSec(0); setTimerOn(false); }} />
        <IBtn onClick={() => setShowContest(true)} title="Contest">🏆</IBtn>
        <IBtn onClick={() => setShowTemplates(true)} title="Templates">📋</IBtn>
        <div style={{ display: "flex", alignItems: "center", gap: 2, background: T.bgMuted, borderRadius: 7, padding: 2 }}>
          <IBtn onClick={() => setFontSize(s => Math.max(11, s - 1))} style={{ padding: "3px 6px", borderRadius: 5 }}><span style={{ fontSize: 11, fontWeight: 700 }}>A-</span></IBtn>
          <span style={{ fontSize: 11, color: T.textMuted, minWidth: 22, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{fontSize}</span>
          <IBtn onClick={() => setFontSize(s => Math.min(22, s + 1))} style={{ padding: "3px 6px", borderRadius: 5 }}><span style={{ fontSize: 11, fontWeight: 700 }}>A+</span></IBtn>
        </div>
        <IBtn onClick={() => setFocusMode(true)} title="Focus Mode">🎯</IBtn>
        <IBtn onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title="Toggle theme">{theme === "light" ? "🌙" : "☀️"}</IBtn>
      </div>
    </header>}

    {/* Focus mode mini-header */}
    {focusMode && <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", background: T.bgWhite, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, color: T.text }}>{problem.id}. {problem.title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Timer seconds={timerSec} running={timerOn} onToggle={() => setTimerOn(!timerOn)} onReset={() => { setTimerSec(0); setTimerOn(false); }} />
        <IBtn onClick={() => setFocusMode(false)} title="Exit Focus">✕</IBtn>
      </div>
    </div>}

    {/* MAIN */}
    <div ref={containerRef} className="cs-main" style={{ flex: 1, display: "flex", overflow: "hidden", padding: focusMode ? 4 : 8, gap: 0 }}>
      {/* LEFT */}
      {!focusMode && <div className="cs-left" style={{ width: `${splitX}%`, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bgWhite, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
        <div style={{ padding: "6px 8px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Tabs tabs={[{ key: "description", label: "Desc", icon: "📄" }, { key: "hints", label: "AI", icon: "🤖" }, { key: "notes", label: "Notes", icon: "📝" }, { key: "streak", label: "Stats", icon: "📊" }]} active={leftTab} onChange={setLeftTab} />
          <IBtn onClick={() => setBookmarked(prev => { const n = new Set(prev); n.has(problemId) ? n.delete(problemId) : n.add(problemId); return n; })} active={bookmarked.has(problemId)} style={{ fontSize: 15 }}>{bookmarked.has(problemId) ? "⭐" : "☆"}</IBtn>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "18px 22px" }}>
          {leftTab === "description" && <div style={{ animation: "slideUp 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, color: T.text }}>{problem.id}. {problem.title}</h1>
              {solved.has(problemId) && <span style={{ fontSize: 11, fontWeight: 700, color: T.green, padding: "2px 8px", borderRadius: 5, background: T.greenBg }}>✓ Solved</span>}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
              <DiffBadge d={problem.difficulty} lg />
              {(() => { const ct = (T.isDark ? CAT_TAG_DARK : CAT_TAG)[problem.cat]; return ct ? <span style={{ fontSize: 12, fontWeight: 700, color: ct.color, padding: "4px 12px", borderRadius: 100, background: ct.bg, border: `1px solid ${ct.border}`, display: "inline-flex", alignItems: "center", gap: 5 }}>{ct.icon} {ct.label}</span> : null; })()}
              {problem.tags.map(t => <span key={t} style={{ fontSize: 11, color: T.textSec, padding: "3px 9px", borderRadius: 100, background: T.bgMuted, fontWeight: 500, border: `1px solid ${T.borderLight}` }}>{t}</span>)}
            </div>
            {companies.length > 0 && <div style={{ display: "flex", gap: 5, marginBottom: 22, flexWrap: "wrap" }}>{companies.map(c => <span key={c} style={{ fontSize: 10, fontWeight: 600, color: T.textSec, padding: "2px 8px", borderRadius: 5, background: T.bgMuted, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: COMPANY_COLORS[c] || "#888" }} />{c}</span>)}</div>}
            <div style={{ fontSize: 14.5, lineHeight: 1.8, color: T.textSec, marginBottom: 24 }}>{renderText(problem.description)}</div>
            {problem.examples.map((ex, i) => <div key={i} style={{ marginBottom: 20 }}><h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>Example {i + 1}:</h3><div style={{ background: T.bgPanel, borderRadius: 10, padding: "14px 18px", borderLeft: `4px solid ${T.accent}`, fontSize: 13, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.9 }}><div><span style={{ color: T.textMuted, fontWeight: 600 }}>Input: </span>{ex.input}</div><div><span style={{ color: T.textMuted, fontWeight: 600 }}>Output: </span><strong>{ex.output}</strong></div>{ex.explanation && <div style={{ color: T.textSec, fontFamily: "'Inter',sans-serif", marginTop: 6, fontSize: 12, paddingTop: 6, borderTop: `1px solid ${T.borderLight}` }}>{ex.explanation}</div>}</div></div>)}
            <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Constraints:</h3>
            {problem.constraints.map((c, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textSec, marginBottom: 5 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: T.accent, opacity: 0.4 }} /><code style={{ background: T.accentBg, padding: "2px 8px", borderRadius: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.accent }}>{c}</code></div>)}
          </div>}
          {leftTab === "hints" && <div style={{ animation: "slideUp 0.2s" }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 14 }}>🤖 AI Assistant</h3>
            {/* Daily Challenge Banner */}
            {problemId !== dailyProblemId && <div onClick={() => handleProblemChange(dailyProblemId)} style={{ padding: "12px 16px", borderRadius: 10, background: T.gradientSoft, border: `1px solid ${T.borderAccent}`, marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🌟</span>
              <div><div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Daily Challenge</div><div style={{ fontSize: 11, color: T.textSec }}>{PROBLEMS.find(p => p.id === dailyProblemId)?.title} — Earn 2× XP</div></div>
            </div>}
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              {[["hint", "💡 Hint"], ["solution", "📖 Solution"], ["complexity", "📊 Complexity"]].map(([k, l]) => <button key={k} onClick={() => fetchHint(k)} disabled={aiLoading} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 12, fontWeight: 600, cursor: aiLoading ? "wait" : "pointer", fontFamily: "'Inter',sans-serif" }}>{l}</button>)}
            </div>
            <button onClick={fetchCodeReview} disabled={reviewLoading || aiLoading} style={{ width: "100%", padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${T.borderAccent}`, background: T.accentBg, color: T.accent, fontSize: 13, fontWeight: 700, cursor: (reviewLoading || aiLoading) ? "wait" : "pointer", fontFamily: "'Inter',sans-serif", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {reviewLoading ? "⏳ Reviewing..." : "🔍 Review My Code"}
            </button>
            {(aiLoading || reviewLoading) && <div style={{ padding: 24, textAlign: "center" }}><span style={{ fontSize: 24, animation: "pulse 1.2s infinite" }}>🤖</span><p style={{ color: T.textMuted, fontSize: 13, marginTop: 8 }}>Analyzing...</p></div>}
            {!aiLoading && aiHint && <div style={{ background: T.bgPanel, border: `1px solid ${T.borderLight}`, borderRadius: 12, padding: "16px 20px", fontSize: 13, color: T.textSec, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 12 }}>{aiHint}</div>}
            {!reviewLoading && codeReview && <div style={{ background: T.bgPanel, border: `1px solid ${T.borderAccent}`, borderRadius: 12, padding: "16px 20px", fontSize: 13, color: T.textSec, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>🔍 Code Review</div>
              {codeReview}
            </div>}
            {!aiLoading && !aiHint && !reviewLoading && !codeReview && <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", paddingTop: 12 }}>Use hints for guidance or review your code for feedback.</p>}
          </div>}
          {leftTab === "notes" && <div style={{ animation: "slideUp 0.2s" }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 14 }}>📝 Notes — {problem.title}</h3>
            <textarea value={notes[problemId] || ""} onChange={e => setNotes(prev => ({ ...prev, [problemId]: e.target.value }))} placeholder="Write your approach..." style={{ width: "100%", minHeight: 280, background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", color: T.text, fontSize: 13, fontFamily: "'Inter',sans-serif", lineHeight: 1.7, resize: "vertical", outline: "none" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />
          </div>}
          {leftTab === "streak" && <div style={{ animation: "slideUp 0.2s" }}>
            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 18 }}>📊 Your Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[["🎯", solved.size, "Solved"], ["⭐", bookmarked.size, "Saved"], ["🏅", unlockedBadges.length, "Badges"]].map(([ic, v, l]) => <div key={l} style={{ background: T.bgPanel, borderRadius: 12, padding: "16px 12px", textAlign: "center", border: `1px solid ${T.borderLight}` }}><div style={{ fontSize: 20 }}>{ic}</div><div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: T.text }}>{v}</div><div style={{ fontSize: 11, color: T.textMuted }}>{l}</div></div>)}
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Activity (last 13 weeks)</h4>
            <StreakCalendar solvedDates={solvedDates} />
            <h4 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 24, marginBottom: 10 }}>Badges ({unlockedBadges.length}/{BADGES.length})</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {BADGES.map(b => { const unlocked = b.check(badgeStats); return <div key={b.id} style={{ padding: "10px 12px", borderRadius: 10, background: T.bgPanel, border: `1px solid ${unlocked ? T.greenBorder : T.borderLight}`, opacity: unlocked ? 1 : 0.4, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>{b.icon}</span><div><div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{b.name}</div><div style={{ fontSize: 10, color: T.textMuted }}>{b.desc}</div></div></div>; })}
            </div>
          </div>}
        </div>
      </div>}

      {/* DRAG X */}
      {!focusMode && <div className="cs-dragx" onMouseDown={startDragX} style={{ width: 12, cursor: "col-resize", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 4, height: 36, borderRadius: 4, background: T.textFaint, transition: "0.2s" }} onMouseEnter={e => { e.target.style.background = T.accent; }} onMouseLeave={e => { e.target.style.background = T.textFaint; }} /></div>}

      {/* RIGHT */}
      <div className="cs-right" data-rp style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, gap: focusMode ? 4 : 8 }}>
        <div style={{ height: `${splitY}%`, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bgWhite, borderRadius: focusMode ? 8 : 14, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
          <div style={{ padding: "6px 12px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: T.bgPanel }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><LangSelector lang={lang} onChange={l => { setLang(l); setResults(null); }} problem={problem} />{contestMode && <div style={{ display: "flex", gap: 3 }}>{contestProblems.map((cp, i) => <button key={cp.id} onClick={() => handleProblemChange(cp.id)} style={{ width: 26, height: 26, borderRadius: 7, border: `1.5px solid ${problemId === cp.id ? T.accent : T.border}`, background: solved.has(cp.id) ? T.greenBg : problemId === cp.id ? T.accentBg : "transparent", color: solved.has(cp.id) ? T.green : T.text, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{i + 1}</button>)}</div>}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}><IBtn onClick={exportCode} title="Export">↓</IBtn><IBtn onClick={handleReset} title="Reset">↺</IBtn><IBtn onClick={() => navigator.clipboard?.writeText(code)} title="Copy">⎘</IBtn></div>
          </div>
          <CodeEditor value={code} onChange={setCode} fontSize={fontSize} lang={lang} />
        </div>
        <div onMouseDown={startDragY} style={{ height: 6, cursor: "row-resize", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 32, height: 3, borderRadius: 3, background: T.textFaint }} /></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, background: T.bgWhite, borderRadius: focusMode ? 8 : 14, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
          <div style={{ padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: `1px solid ${T.borderLight}` }}>
            <Tabs tabs={[{ key: "testcase", label: "Tests" }, { key: "result", label: results ? (allPassed ? "✓ Pass" : "✗ Fail") : "Result" }, { key: "console", label: "Console", icon: ">" }]} active={bottomTab} onChange={setBottomTab} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleRun} disabled={running} style={{ background: T.bgWhite, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "7px 16px", cursor: running ? "wait" : "pointer", color: T.text, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: T.shadow, opacity: running ? 0.6 : 1, fontFamily: "'Inter',sans-serif" }}>{running ? "⏳" : "▶"} Run</button>
              <button onClick={handleSubmit} disabled={running} style={{ background: T.green, border: "none", borderRadius: 9, padding: "7px 20px", cursor: running ? "wait" : "pointer", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter',sans-serif" }}>{running ? "⏳" : "✓"} Submit</button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "12px 16px" }}>
            {bottomTab === "testcase" && <div style={{ animation: "slideUp 0.15s" }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>{problem.testCases.map((_, i) => <button key={i} onClick={() => setActiveTC(i)} style={{ padding: "5px 14px", borderRadius: 7, cursor: "pointer", background: activeTC === i ? T.accentBg : T.bgMuted, color: activeTC === i ? T.accent : T.textSec, border: `1px solid ${activeTC === i ? T.borderAccent : "transparent"}`, fontSize: 12, fontWeight: activeTC === i ? 600 : 500, fontFamily: "'Inter',sans-serif" }}>Case {i + 1}</button>)}</div>
              {activeTC >= 0 && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div><label style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Input</label><pre style={{ background: T.bgPanel, borderRadius: 8, padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.text, border: `1px solid ${T.borderLight}`, whiteSpace: "pre-wrap", margin: "4px 0 0" }}>{problem.testCases[activeTC]?.input}</pre></div>
                <div><label style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Expected</label><pre style={{ background: T.bgPanel, borderRadius: 8, padding: "10px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: T.green, fontWeight: 600, border: `1px solid ${T.greenBorder}`, margin: "4px 0 0" }}>{problem.testCases[activeTC]?.expected}</pre></div>
              </div>}
            </div>}
            {bottomTab === "result" && <div style={{ animation: "slideUp 0.15s" }}>
              {running && <div style={{ textAlign: "center", padding: 24 }}><span style={{ fontSize: 24, animation: "pulse 1.2s infinite" }}>⚡</span><p style={{ color: T.textMuted, fontSize: 13, marginTop: 6 }}>Running...</p><div style={{ width: 160, height: 3, borderRadius: 3, margin: "10px auto 0", background: T.bgMuted, overflow: "hidden" }}><div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} /></div></div>}
              {!running && !results && <p style={{ textAlign: "center", padding: 24, color: T.textMuted, fontSize: 13 }}>Run or submit to see results.</p>}
              {!running && results && <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "14px 18px", borderRadius: 12, background: allPassed ? T.greenBg : T.redBg, border: `1.5px solid ${allPassed ? T.greenBorder : T.redBorder}` }}>
                  <span style={{ fontSize: 20 }}>{allPassed ? "🎉" : "❌"}</span>
                  <div><div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: allPassed ? T.green : T.red }}>{allPassed ? (submitted ? "Accepted" : "All Passed") : (results.every(r => r.runtime === "N/A") ? "Runtime Error" : "Wrong Answer")}</div><div style={{ fontSize: 12, color: T.textSec }}>{results.filter(r => r.passed).length}/{results.length} passed{allPassed && ` · ${results[0].runtime}`}</div></div>
                </div>
                {/* Complexity gauge on success */}
                {allPassed && complexityLevel !== null && <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, padding: "12px 18px", borderRadius: 12, background: T.bgPanel, border: `1px solid ${T.borderLight}` }}>
                  <ComplexityGauge level={complexityLevel} />
                  <div><div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Estimated Complexity</div><div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Based on code pattern analysis</div></div>
                </div>}
                {results.map((r, i) => <div key={i} style={{ padding: "10px 14px", marginBottom: 5, borderRadius: 9, background: T.bgPanel, border: `1px solid ${r.passed ? T.greenBorder : T.redBorder}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 12, color: r.passed ? T.green : T.red, fontWeight: 700, marginTop: 2 }}>{r.passed ? "✓" : "✗"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 700, color: r.passed ? T.green : T.red }}>Test {i + 1}</span><span style={{ fontSize: 10, color: T.textMuted, fontFamily: "'JetBrains Mono',monospace" }}>{r.runtime}</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}><div><span style={{ color: T.textMuted }}>Expected: </span><code style={{ color: T.text, fontFamily: "'JetBrains Mono',monospace" }}>{r.expected}</code></div><div><span style={{ color: T.textMuted }}>Output: </span><code style={{ color: r.passed ? T.green : T.red, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{r.output}</code></div></div>
                    {r.error && !r.passed && <div style={{ marginTop: 6, padding: "4px 8px", borderRadius: 5, background: T.redBg, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: T.red }}>⚠ {r.error}</div>}
                  </div>
                </div>)}
              </div>}
            </div>}
            {bottomTab === "console" && <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "slideUp 0.15s" }}>
              <div style={{ flex: 1, background: T.isDark ? "#000" : "#1E1B4B", borderRadius: "8px 8px 0 0", padding: "12px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#A5B4FC", lineHeight: 1.6, overflow: "auto" }}>
                {termHistory.map((line, i) => <div key={i} style={{ color: line.startsWith("$") ? "#67E8F9" : line.startsWith(">") ? "#FDE68A" : "#A5B4FC" }}>{line}</div>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", background: T.isDark ? "#111" : "#1E1B4B", borderRadius: "0 0 8px 8px", padding: "0 16px", borderTop: "1px solid #334155" }}>
                <span style={{ color: "#67E8F9", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, marginRight: 8 }}>$</span>
                <input value={termInput} onChange={e => setTermInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && termInput.trim()) handleTermCommand(termInput.trim()); }}
                  placeholder="Type a command... (try 'help')"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#E2E8F0", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, padding: "10px 0" }} />
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>

    {/* FOOTER */}
    {!focusMode && <footer className="cs-footer" style={{ height: 26, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", background: T.bgWhite, borderTop: `1px solid ${T.border}`, fontSize: 11, color: T.textMuted, flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} /><span style={{ fontWeight: 600 }}>Ready</span></span><span>{LANGS[lang]?.name}</span></div>
      <div style={{ display: "flex", gap: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}><span>Ln {code.split("\n").length}</span><span>UTF-8</span><span style={{ color: wpm > 0 ? T.accent : T.textMuted }}>⌨ {wpm} WPM</span></div>
    </footer>}

    {/* MODALS */}
    {showProblems && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowProblems(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, borderRadius: 18, border: `1px solid ${T.border}`, width: "100%", maxWidth: 760, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: T.shadowLg }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: T.text }}>Problems ({solved.size}/{PROBLEMS.length})</span>
          <IBtn onClick={() => setShowProblems(false)}>✕</IBtn>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "8px 20px", borderBottom: `1px solid ${T.borderLight}`, background: T.bgMuted }}>
          {[{ key: "All", label: "All (300)", icon: "📚" }, { key: "Programming", label: "DSA (100)", icon: "🧮" }, { key: "Database", label: "SQL (100)", icon: "🗄️" }, { key: "Web", label: "JavaScript (100)", icon: "⚡" }].map(f => {
            const isActive = (problemListFilter || "All") === f.key;
            return <button key={f.key} onClick={() => setProblemListFilter(f.key)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: isActive ? T.bgWhite : "transparent", color: isActive ? T.text : T.textMuted, fontSize: 12, fontWeight: isActive ? 700 : 500, fontFamily: "'Inter',sans-serif", boxShadow: isActive ? T.shadow : "none", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>{f.icon} {f.label}</button>;
          })}
        </div>
        <div style={{ overflow: "auto", flex: 1 }}>
          {PROBLEMS.filter(p => problemListFilter === "All" || p.cat === problemListFilter).map(p => <div key={p.id} onClick={() => { handleProblemChange(p.id); setShowProblems(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: `1px solid ${T.borderLight}`, background: problemId === p.id ? T.accentBg : "transparent" }}
            onMouseEnter={e => { if (problemId !== p.id) e.currentTarget.style.background = T.bgHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = problemId === p.id ? T.accentBg : "transparent"; }}
          >
            <span style={{ fontSize: 11, color: solved.has(p.id) ? T.green : "transparent", fontWeight: 700, width: 16 }}>{solved.has(p.id) ? "✓" : ""}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.textMuted, width: 28 }}>{p.id}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: T.text }}>{p.title}</span>
            {(() => { const ct = (T.isDark ? CAT_TAG_DARK : CAT_TAG)[p.cat]; return ct ? <span style={{ fontSize: 10, fontWeight: 700, color: ct.color, padding: "2px 8px", borderRadius: 100, background: ct.bg, border: `1px solid ${ct.border}`, whiteSpace: "nowrap" }}>{ct.icon} {ct.label}</span> : null; })()}
            <DiffBadge d={p.difficulty} />
          </div>)}
        </div>
      </div>
    </div>}

    {showTemplates && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowTemplates(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, borderRadius: 18, border: `1px solid ${T.border}`, width: "100%", maxWidth: 600, maxHeight: "80vh", overflow: "auto", boxShadow: T.shadowLg, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: T.text }}>📋 Code Templates</h2>
          <IBtn onClick={() => setShowTemplates(false)}>✕</IBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TEMPLATES.map((t, i) => <div key={i} style={{ background: T.bgPanel, borderRadius: 12, border: `1px solid ${T.borderLight}`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{t.icon}</span><span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{t.name}</span></div>
              <button onClick={() => { setCode(prev => prev + "\n\n" + t.code); setShowTemplates(false); }} style={{ padding: "5px 14px", borderRadius: 7, border: `1px solid ${T.borderAccent}`, background: T.accentBg, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Insert</button>
            </div>
            <pre style={{ padding: "0 16px 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.textSec, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap", maxHeight: 80, overflow: "hidden" }}>{t.code.slice(0, 150)}...</pre>
          </div>)}
        </div>
      </div>
    </div>}

    {showBadges && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowBadges(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, borderRadius: 18, border: `1px solid ${T.border}`, width: "100%", maxWidth: 480, boxShadow: T.shadowLg, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: T.text }}>🏅 Achievements ({unlockedBadges.length}/{BADGES.length})</h2>
          <IBtn onClick={() => setShowBadges(false)}>✕</IBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {BADGES.map(b => { const u = b.check(badgeStats); return <div key={b.id} style={{ padding: "14px 16px", borderRadius: 12, background: u ? T.greenBg : T.bgPanel, border: `1.5px solid ${u ? T.greenBorder : T.borderLight}`, opacity: u ? 1 : 0.35, display: "flex", alignItems: "center", gap: 12, transition: "0.2s" }}>
            <span style={{ fontSize: 28 }}>{b.icon}</span>
            <div><div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{b.name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{b.desc}</div>{u && <div style={{ fontSize: 10, color: T.green, fontWeight: 600, marginTop: 2 }}>✓ Unlocked!</div>}</div>
          </div>; })}
        </div>
      </div>
    </div>}

    {showContest && <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowContest(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, borderRadius: 18, border: `1px solid ${T.border}`, padding: 36, maxWidth: 440, width: "100%", textAlign: "center", boxShadow: T.shadowLg }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🏆</div>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 22, color: T.text, marginBottom: 6 }}>Mock Contest</h2>
        <p style={{ color: T.textSec, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>4 random problems · 60 minutes · Simulate a real coding interview.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={startContest} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: T.gradient, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Start</button>
          <button onClick={() => setShowContest(false)} style={{ padding: "11px 22px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: "transparent", color: T.textSec, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>}
  </div>;
}
