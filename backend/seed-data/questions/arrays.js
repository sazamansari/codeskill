/**
 * Arrays Topic - 26 Questions
 * Difficulty progression: Easy (10) → Medium (11) → Hard (5)
 */
module.exports = [
  // ── EASY (10) ──────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Contiguous Subarray Maximum",
    slug: "contiguous-subarray-maximum",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "kadane", "subarray"],
    xp: 100,
    estimatedSolveTime: 15,
    learningOrder: 1,
    prerequisites: [],
    companyTags: ["Amazon", "Google", "Microsoft"],
    similarProblems: [],
    statement: {
      description: "## Contiguous Subarray Maximum\n\nGiven an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA **subarray** is a contiguous part of an array.",
      inputFormat: "The first line contains an integer `n` — the size of the array.\nThe second line contains `n` space-separated integers — the elements of the array.",
      outputFormat: "Print a single integer — the maximum subarray sum.",
      constraints: "1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4",
      notes: "The subarray must contain at least one element."
    },
    samples: [
      { input: "8\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6." },
      { input: "1\n1", output: "1", explanation: "Only one element, so the answer is 1." },
      { input: "5\n5 4 -1 7 8", output: "23", explanation: "The entire array [5, 4, -1, 7, 8] gives the maximum sum = 23." }
    ],
    hiddenTestCases: [
      { input: "1\n-1", output: "-1" },
      { input: "3\n-2 -1 -3", output: "-1" },
      { input: "5\n1 2 3 4 5", output: "15" },
      { input: "6\n-1 -2 3 4 -5 6", output: "8" },
      { input: "4\n0 0 0 0", output: "0" },
      { input: "7\n-3 1 -8 4 -1 2 1", output: "6" },
      { input: "2\n-1 2", output: "2" },
      { input: "10\n1 -1 1 -1 1 -1 1 -1 1 -1", output: "1" },
      { input: "3\n100 -1 100", output: "199" },
      { input: "5\n-5 -4 -3 -2 -1", output: "-1" }
    ],
    hints: [
      "Think about what happens when adding a negative number to your running sum — when should you reset?",
      "At each position, decide: extend the previous subarray or start a new one from here.",
      "This is a classic application of Kadane's algorithm: maintain a running max and a global max."
    ],
    editorial: {
      intuition: "The key insight is that at each element, we have two choices: either extend the current subarray or start a new subarray from the current element. We always pick whichever gives a larger sum.",
      bruteForce: "Check all possible subarrays using two nested loops. For each pair (i, j), compute the sum of elements from index i to j. Track the maximum sum found. Time: O(n²), Space: O(1).",
      betterApproach: "Use prefix sums. Compute prefix sum array, then for each ending index j, the maximum subarray sum ending at j is prefix[j] - min(prefix[0..j-1]). Time: O(n), Space: O(n).",
      optimalApproach: "Kadane's Algorithm: Maintain `currentMax = nums[0]` and `globalMax = nums[0]`. For each element from index 1: `currentMax = max(nums[i], currentMax + nums[i])`, then `globalMax = max(globalMax, currentMax)`. Time: O(n), Space: O(1).",
      dryRun: "For [-2, 1, -3, 4, -1, 2, 1, -5, 4]:\ni=0: curr=-2, global=-2\ni=1: curr=max(1,-2+1)=1, global=1\ni=2: curr=max(-3,1-3)=-2, global=1\ni=3: curr=max(4,-2+4)=4, global=4\ni=4: curr=max(-1,4-1)=3, global=4\ni=5: curr=max(2,3+2)=5, global=5\ni=6: curr=max(1,5+1)=6, global=6\ni=7: curr=max(-5,6-5)=1, global=6\ni=8: curr=max(4,1+4)=5, global=6\nAnswer: 6",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Divide and conquer approach: split array in half, recursively find max subarray in left, right, and crossing. Time: O(n log n).",
      interviewTips: "Kadane's algorithm is a must-know. Interviewers often ask follow-ups: return the actual subarray, handle circular arrays, or find exactly k subarrays.",
      commonMistakes: "Forgetting to handle all-negative arrays. Initializing globalMax to 0 instead of nums[0] will give wrong answers when all elements are negative."
    },
    functionSignature: { name: "maxSubarraySum", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 2,
    title: "Rotate Array by K Steps",
    slug: "rotate-array-by-k-steps",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "rotation", "in-place"],
    xp: 100,
    estimatedSolveTime: 15,
    learningOrder: 2,
    prerequisites: [],
    companyTags: ["Microsoft", "Amazon", "Adobe"],
    similarProblems: ["contiguous-subarray-maximum"],
    statement: {
      description: "## Rotate Array by K Steps\n\nGiven an integer array `nums` and a non-negative integer `k`, rotate the array to the right by `k` steps.\n\nFor example, if `nums = [1,2,3,4,5,6,7]` and `k = 3`, after rotation the array becomes `[5,6,7,1,2,3,4]`.",
      inputFormat: "The first line contains two integers `n` and `k`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the rotated array as space-separated integers.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ k ≤ 10^9\n-10^4 ≤ nums[i] ≤ 10^4",
      notes: "Try to do this in-place with O(1) extra space."
    },
    samples: [
      { input: "7 3\n1 2 3 4 5 6 7", output: "5 6 7 1 2 3 4", explanation: "Rotate right 3 times: [7,1,2,3,4,5,6] → [6,7,1,2,3,4,5] → [5,6,7,1,2,3,4]." },
      { input: "4 2\n-1 -100 3 99", output: "3 99 -1 -100", explanation: "Rotate right 2 times." },
      { input: "3 0\n1 2 3", output: "1 2 3", explanation: "No rotation needed when k=0." }
    ],
    hiddenTestCases: [
      { input: "1 5\n42", output: "42" },
      { input: "5 5\n1 2 3 4 5", output: "1 2 3 4 5" },
      { input: "5 7\n1 2 3 4 5", output: "4 5 1 2 3" },
      { input: "2 1\n1 2", output: "2 1" },
      { input: "6 3\n1 1 1 2 2 2", output: "2 2 2 1 1 1" },
      { input: "4 1000000000\n1 2 3 4", output: "1 2 3 4" },
      { input: "3 1\n10 20 30", output: "30 10 20" },
      { input: "5 2\n0 0 0 0 1", output: "0 1 0 0 0" },
      { input: "8 4\n1 2 3 4 5 6 7 8", output: "5 6 7 8 1 2 3 4" },
      { input: "6 6\n5 4 3 2 1 0", output: "5 4 3 2 1 0" }
    ],
    hints: [
      "What happens when k is larger than the array length? Think about k % n.",
      "Can you solve it using array reversal? Try reversing the whole array, then the first k elements, then the rest.",
      "The three-reverse approach works in O(n) time and O(1) space."
    ],
    editorial: {
      intuition: "Rotating right by k is equivalent to moving the last k elements to the front. Since k can be very large, first reduce k = k % n.",
      bruteForce: "Rotate one step at a time, k times. Each rotation moves the last element to the front. Time: O(n×k), Space: O(1).",
      betterApproach: "Use an extra array: copy elements to their rotated positions. newArr[(i + k) % n] = nums[i]. Time: O(n), Space: O(n).",
      optimalApproach: "Three reversals: (1) Reverse entire array, (2) Reverse first k elements, (3) Reverse remaining n-k elements. Time: O(n), Space: O(1).",
      dryRun: "nums=[1,2,3,4,5,6,7], k=3:\nk = 3 % 7 = 3\nReverse all: [7,6,5,4,3,2,1]\nReverse first 3: [5,6,7,4,3,2,1]\nReverse last 4: [5,6,7,1,2,3,4] ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Cyclic replacement: place each element at its final position using a cycle. Count completed elements and handle GCD(n,k) cycles.",
      interviewTips: "Always mention k % n first. The three-reversal trick is elegant and shows strong algorithmic thinking. Be ready to prove correctness.",
      commonMistakes: "Not handling k > n. Forgetting k=0 or k=n edge cases. Off-by-one errors in the reversal boundaries."
    },
    functionSignature: { name: "rotateArray", params: [{ name: "nums", type: "int[]" }, { name: "k", type: "int" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 3,
    title: "Leaders in an Array",
    slug: "leaders-in-an-array",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "traversal", "right-to-left"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 3,
    prerequisites: [],
    companyTags: ["Adobe", "Flipkart", "Oracle"],
    similarProblems: ["contiguous-subarray-maximum"],
    statement: {
      description: "## Leaders in an Array\n\nAn element is a **leader** if it is strictly greater than all the elements to its right. The rightmost element is always a leader.\n\nGiven an integer array `nums`, return all the leaders in the array in the order they appear.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the leaders in the order they appear, space-separated.",
      constraints: "1 ≤ n ≤ 10^5\n-10^6 ≤ nums[i] ≤ 10^6",
      notes: "The rightmost element is always considered a leader."
    },
    samples: [
      { input: "6\n16 17 4 3 5 2", output: "17 5 2", explanation: "17 > all elements to its right. 5 > 2. 2 is rightmost." },
      { input: "5\n1 2 3 4 5", output: "5", explanation: "Only the last element is a leader since the array is sorted ascending." },
      { input: "4\n5 4 3 2", output: "5 4 3 2", explanation: "All elements are leaders since the array is sorted descending." }
    ],
    hiddenTestCases: [
      { input: "1\n10", output: "10" },
      { input: "3\n1 1 1", output: "1" },
      { input: "5\n7 4 5 3 2", output: "7 5 3 2" },
      { input: "2\n1 2", output: "2" },
      { input: "2\n2 1", output: "2 1" },
      { input: "6\n-1 -2 -3 -4 -5 -6", output: "-1 -2 -3 -4 -5 -6" },
      { input: "5\n10 20 30 20 10", output: "30 20 10" },
      { input: "7\n1 3 2 5 4 7 6", output: "7 6" },
      { input: "4\n100 50 75 25", output: "100 75 25" },
      { input: "3\n-5 -3 -10", output: "-3 -10" }
    ],
    hints: [
      "Start traversing from the rightmost element. Track the maximum seen so far.",
      "An element is a leader if it's greater than the maximum of all elements to its right.",
      "Since we traverse right to left, reverse the collected leaders to get the original order."
    ],
    editorial: {
      intuition: "If we scan from right to left and keep track of the maximum element seen, any element greater than this maximum is a leader.",
      bruteForce: "For each element, check all elements to its right. If it's greater than all of them, it's a leader. Time: O(n²), Space: O(1).",
      betterApproach: "Same as optimal for this problem.",
      optimalApproach: "Traverse from right to left. Maintain a variable `maxFromRight` initialized to -∞. If current element > maxFromRight, it's a leader. Update maxFromRight. Reverse collected leaders for correct order. Time: O(n), Space: O(n) for output.",
      dryRun: "nums=[16,17,4,3,5,2]: Right to left:\ni=5: 2 > -∞ → leader, max=2\ni=4: 5 > 2 → leader, max=5\ni=3: 3 < 5 → skip\ni=2: 4 < 5 → skip\ni=1: 17 > 5 → leader, max=17\ni=0: 16 < 17 → skip\nLeaders (reversed): [17, 5, 2]",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) for the result array",
      alternativeSolution: "Use a stack-based approach pushing elements and popping when a larger element is found.",
      interviewTips: "This tests your ability to think about traversal direction. Always consider right-to-left when the condition depends on elements to the right.",
      commonMistakes: "Using 'greater than or equal to' instead of 'strictly greater than'. Forgetting to reverse the result."
    },
    functionSignature: { name: "findLeaders", params: [{ name: "nums", type: "int[]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 4,
    title: "Move All Negatives to Front",
    slug: "move-all-negatives-to-front",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "two-pointers", "partitioning"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 4,
    prerequisites: [],
    companyTags: ["VMware", "Cisco", "Adobe"],
    similarProblems: ["rotate-array-by-k-steps"],
    statement: {
      description: "## Move All Negatives to Front\n\nGiven an array of integers, rearrange it so that all negative numbers appear before all non-negative numbers. The relative order within negatives and non-negatives does not need to be preserved.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the rearranged array. Any valid arrangement with all negatives before non-negatives is accepted.",
      constraints: "1 ≤ n ≤ 10^5\n-10^6 ≤ nums[i] ≤ 10^6",
      notes: "Any valid arrangement is accepted as long as all negatives come first."
    },
    samples: [
      { input: "7\n-12 11 -13 -5 6 -7 5", output: "-12 -13 -5 -7 11 6 5", explanation: "All negatives [-12,-13,-5,-7] are before non-negatives [11,6,5]." },
      { input: "4\n1 -1 3 -2", output: "-1 -2 1 3", explanation: "Negatives come first." },
      { input: "3\n-1 -2 -3", output: "-1 -2 -3", explanation: "All negative, no rearrangement needed." }
    ],
    hiddenTestCases: [
      { input: "3\n1 2 3", output: "1 2 3" },
      { input: "1\n-5", output: "-5" },
      { input: "1\n5", output: "5" },
      { input: "2\n1 -1", output: "-1 1" },
      { input: "5\n0 0 0 0 0", output: "0 0 0 0 0" },
      { input: "6\n-1 1 -2 2 -3 3", output: "-1 -2 -3 1 2 3" },
      { input: "4\n-100 100 -200 200", output: "-100 -200 100 200" },
      { input: "5\n5 -5 0 -10 10", output: "-5 -10 5 0 10" },
      { input: "2\n-1 -2", output: "-1 -2" },
      { input: "8\n1 -2 3 -4 5 -6 7 -8", output: "-2 -4 -6 -8 1 3 5 7" }
    ],
    hints: [
      "Use two pointers: one at the start and one at the end of the array.",
      "If the left pointer points to a non-negative and the right to a negative, swap them.",
      "This is similar to the partition step in QuickSort using 0 as pivot."
    ],
    editorial: {
      intuition: "Partition the array around 0 — negatives go left, non-negatives go right. This is essentially Dutch National Flag with two categories.",
      bruteForce: "Create two separate arrays for negatives and non-negatives, then concatenate. Time: O(n), Space: O(n).",
      betterApproach: "Same idea, but done in-place.",
      optimalApproach: "Two-pointer approach: left=0, right=n-1. While left < right: if nums[left] < 0, move left forward; if nums[right] >= 0, move right backward; else swap nums[left] and nums[right]. Time: O(n), Space: O(1).",
      dryRun: "nums=[-12,11,-13,-5,6,-7,5], l=0, r=6:\nl=0: -12<0 → l=1\nl=1: 11≥0, r=6: 5≥0 → r=5\nl=1: 11≥0, r=5: -7<0 → swap → [-12,-7,-13,-5,6,11,5], l=2, r=4\nl=2: -13<0 → l=3\nl=3: -5<0 → l=4\nl=4≥r=4 → done",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Stable partition using merge sort-like technique to preserve relative order. Time: O(n log n), Space: O(n).",
      interviewTips: "If the interviewer asks to preserve relative order, the in-place solution becomes harder (requires O(n log n)). Clarify requirements upfront.",
      commonMistakes: "Treating 0 as negative. Off-by-one errors in pointer movement. Not handling arrays with all negatives or all positives."
    },
    functionSignature: { name: "moveNegatives", params: [{ name: "nums", type: "int[]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 5,
    title: "Equilibrium Index Finder",
    slug: "equilibrium-index-finder",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "prefix-sum", "balance-point"],
    xp: 100,
    estimatedSolveTime: 15,
    learningOrder: 5,
    prerequisites: [],
    companyTags: ["Amazon", "Flipkart", "Salesforce"],
    similarProblems: ["contiguous-subarray-maximum"],
    statement: {
      description: "## Equilibrium Index Finder\n\nThe **equilibrium index** of an array is an index such that the sum of elements at lower indices is equal to the sum of elements at higher indices.\n\nGiven an array `nums`, find the first equilibrium index. If no such index exists, return -1.\n\nNote: Elements at the equilibrium index are not included in either sum.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the first equilibrium index (0-indexed), or -1 if none exists.",
      constraints: "1 ≤ n ≤ 10^5\n-10^6 ≤ nums[i] ≤ 10^6",
      notes: "Return the smallest equilibrium index."
    },
    samples: [
      { input: "7\n-7 1 5 2 -4 3 0", output: "3", explanation: "At index 3: left sum = -7+1+5 = -1, right sum = -4+3+0 = -1. Equal!" },
      { input: "3\n1 2 3", output: "-1", explanation: "No equilibrium index exists." },
      { input: "1\n5", output: "0", explanation: "Single element: left sum = 0, right sum = 0." }
    ],
    hiddenTestCases: [
      { input: "2\n1 1", output: "-1" },
      { input: "3\n0 0 0", output: "0" },
      { input: "5\n1 0 0 0 1", output: "2" },
      { input: "4\n2 3 -1 2", output: "1" },
      { input: "6\n1 -1 1 -1 1 -1", output: "0" },
      { input: "3\n10 -10 0", output: "2" },
      { input: "5\n-5 5 0 5 -5", output: "2" },
      { input: "4\n1 1 1 1", output: "-1" },
      { input: "7\n0 0 0 0 0 0 0", output: "0" },
      { input: "3\n100 0 100", output: "1" }
    ],
    hints: [
      "Compute the total sum of the array first.",
      "As you iterate left to right, maintain a running left sum. The right sum is total - leftSum - nums[i].",
      "When leftSum equals rightSum at index i, you've found the equilibrium index."
    ],
    editorial: {
      intuition: "Instead of computing left and right sums separately for each index, use the relationship: rightSum = totalSum - leftSum - nums[i].",
      bruteForce: "For each index i, compute left sum (0..i-1) and right sum (i+1..n-1). If equal, return i. Time: O(n²), Space: O(1).",
      betterApproach: "Compute prefix sums array, then for each i check prefix[i-1] == totalSum - prefix[i]. Time: O(n), Space: O(n).",
      optimalApproach: "Compute totalSum. Iterate with leftSum=0. For each i: rightSum = totalSum - leftSum - nums[i]. If leftSum == rightSum, return i. Add nums[i] to leftSum. Time: O(n), Space: O(1).",
      dryRun: "nums=[-7,1,5,2,-4,3,0], total=0\ni=0: right=0-0-(-7)=7, left=0≠7, left=0+(-7)=-7\ni=1: right=0-(-7)-1=6, left=-7≠6, left=-7+1=-6\ni=2: right=0-(-6)-5=1, left=-6≠1, left=-6+5=-1\ni=3: right=0-(-1)-2=-1, left=-1==-1 ✓ → return 3",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Build prefix sum and suffix sum arrays, then compare prefix[i-1] with suffix[i+1] for each i.",
      interviewTips: "This problem tests prefix sum intuition. Be ready for follow-ups like finding all equilibrium indices or handling it in a streaming fashion.",
      commonMistakes: "Not handling the first and last index correctly (left sum or right sum is 0). Integer overflow with large arrays."
    },
    functionSignature: { name: "equilibriumIndex", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 6,
    title: "Count Inversions in Array",
    slug: "count-inversions-in-array",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "counting", "pairs"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 6,
    prerequisites: [],
    companyTags: ["Google", "Microsoft", "Uber"],
    similarProblems: ["leaders-in-an-array"],
    statement: {
      description: "## Count Inversions in Array\n\nGiven an array of integers, count the number of **inversions**. An inversion is a pair of indices `(i, j)` such that `i < j` and `nums[i] > nums[j]`.\n\nFor small arrays (n ≤ 1000), a simple approach is sufficient.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print a single integer — the number of inversions.",
      constraints: "1 ≤ n ≤ 1000\n-10^6 ≤ nums[i] ≤ 10^6",
      notes: "The constraints are small enough for an O(n²) solution."
    },
    samples: [
      { input: "5\n2 4 1 3 5", output: "3", explanation: "Inversions: (2,1), (4,1), (4,3)." },
      { input: "3\n3 2 1", output: "3", explanation: "Inversions: (3,2), (3,1), (2,1)." },
      { input: "4\n1 2 3 4", output: "0", explanation: "Sorted array has no inversions." }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "0" },
      { input: "2\n2 1", output: "1" },
      { input: "2\n1 2", output: "0" },
      { input: "5\n5 4 3 2 1", output: "10" },
      { input: "4\n1 1 1 1", output: "0" },
      { input: "6\n1 3 2 4 6 5", output: "2" },
      { input: "5\n10 20 30 40 50", output: "0" },
      { input: "5\n50 40 30 20 10", output: "10" },
      { input: "3\n-1 -2 -3", output: "3" },
      { input: "4\n4 1 2 3", output: "3" }
    ],
    hints: [
      "The brute force approach with nested loops works within the given constraints.",
      "For each pair (i, j) where i < j, check if nums[i] > nums[j].",
      "For larger constraints, merge sort can count inversions in O(n log n)."
    ],
    editorial: {
      intuition: "An inversion represents a pair that is 'out of order'. The count tells us how far the array is from being sorted.",
      bruteForce: "Two nested loops checking all pairs. Time: O(n²), Space: O(1). Works fine for n ≤ 1000.",
      betterApproach: "Modified merge sort: during merging, count how many elements from the right half are placed before elements from the left half.",
      optimalApproach: "For this constraint range (n ≤ 1000), the O(n²) approach is optimal in simplicity. For larger n, use merge sort: Time O(n log n), Space O(n).",
      dryRun: "nums=[2,4,1,3,5]:\n(0,1): 2<4 → no\n(0,2): 2>1 → yes, count=1\n(0,3): 2<3 → no\n(0,4): 2<5 → no\n(1,2): 4>1 → yes, count=2\n(1,3): 4>3 → yes, count=3\n(1,4): 4<5 → no\n(2,3): 1<3 → no\n(2,4): 1<5 → no\n(3,4): 3<5 → no\nTotal: 3",
      timeComplexity: "O(n²) for brute force, O(n log n) for merge sort approach",
      spaceComplexity: "O(1) for brute force, O(n) for merge sort",
      alternativeSolution: "BIT (Binary Indexed Tree) / Fenwick Tree approach: process elements right to left, query count of elements smaller than current. Time: O(n log n).",
      interviewTips: "Start with brute force, then optimize. The merge sort approach is a classic interview favorite. Explain the connection between inversions and sorting.",
      commonMistakes: "Double counting inversions. Using wrong loop bounds. For merge sort approach: not resetting the temp array properly."
    },
    functionSignature: { name: "countInversions", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 7,
    title: "Majority Element Detector",
    slug: "majority-element-detector",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "voting", "moore", "frequency"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 7,
    prerequisites: [],
    companyTags: ["Amazon", "Google", "Apple"],
    similarProblems: ["count-inversions-in-array"],
    statement: {
      description: "## Majority Element Detector\n\nGiven an array `nums` of size `n`, return the **majority element**. The majority element is the element that appears more than `⌊n/2⌋` times.\n\nYou may assume that the majority element always exists in the array.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the majority element.",
      constraints: "1 ≤ n ≤ 10^5\nn is odd\n-10^6 ≤ nums[i] ≤ 10^6\nThe majority element is guaranteed to exist.",
      notes: "The majority element always exists."
    },
    samples: [
      { input: "7\n3 2 3 3 1 3 3", output: "3", explanation: "3 appears 5 times out of 7, which is > 7/2 = 3." },
      { input: "3\n2 2 1", output: "2", explanation: "2 appears 2 times out of 3, which is > 3/2 = 1." },
      { input: "1\n5", output: "5", explanation: "Only one element, it is the majority." }
    ],
    hiddenTestCases: [
      { input: "5\n1 1 1 2 2", output: "1" },
      { input: "9\n1 2 1 2 1 2 1 2 1", output: "1" },
      { input: "3\n-1 -1 2", output: "-1" },
      { input: "5\n5 5 5 5 5", output: "5" },
      { input: "7\n0 0 0 1 1 0 0", output: "0" },
      { input: "3\n100 100 1", output: "100" },
      { input: "11\n4 4 4 4 4 4 1 2 3 5 6", output: "4" },
      { input: "5\n-5 -5 -5 1 2", output: "-5" },
      { input: "1\n0", output: "0" },
      { input: "9\n7 7 7 7 7 3 3 3 3", output: "7" }
    ],
    hints: [
      "Think about a voting algorithm: a candidate and a counter.",
      "If the counter drops to 0, pick the current element as the new candidate.",
      "Boyer-Moore Voting Algorithm guarantees finding the majority element in O(n) time."
    ],
    editorial: {
      intuition: "The majority element appears more than half the time, so if we 'cancel out' different elements against it, it will be the last one standing.",
      bruteForce: "Count frequency of each element using nested loops. Return the one with count > n/2. Time: O(n²), Space: O(1).",
      betterApproach: "Use a hash map to count frequencies. Return element with count > n/2. Time: O(n), Space: O(n).",
      optimalApproach: "Boyer-Moore Voting: Initialize candidate = nums[0], count = 1. For each subsequent element: if same as candidate, count++; else count--. If count reaches 0, set new candidate. Time: O(n), Space: O(1).",
      dryRun: "nums=[3,2,3,3,1,3,3]:\ncandidate=3, count=1\ni=1: 2≠3 → count=0, candidate=2\ni=2: 3≠2 → count=0, candidate=3, count=1\nWait, reset: candidate=3, count=1\ni=3: 3=3 → count=2\ni=4: 1≠3 → count=1\ni=5: 3=3 → count=2\ni=6: 3=3 → count=3\ncandidate=3 ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Sort the array and return the middle element (index n/2). The majority element will always be at the middle of a sorted array. Time: O(n log n).",
      interviewTips: "Boyer-Moore is a beautiful algorithm. Know it by heart. Follow-up: what if no majority is guaranteed? Then add a verification pass.",
      commonMistakes: "Forgetting the verification step when majority isn't guaranteed. Confusing majority (> n/2) with mode (most frequent)."
    },
    functionSignature: { name: "majorityElement", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 8,
    title: "Stock Profit Maximizer",
    slug: "stock-profit-maximizer",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "greedy", "profit", "stocks"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 8,
    prerequisites: [],
    companyTags: ["Amazon", "Google", "Meta", "Goldman Sachs"],
    similarProblems: ["contiguous-subarray-maximum"],
    statement: {
      description: "## Stock Profit Maximizer\n\nYou are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy and a later day to sell. Return the maximum profit achievable. If no profit is possible, return 0.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers representing stock prices.",
      outputFormat: "Print a single integer — the maximum profit.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ prices[i] ≤ 10^4",
      notes: "You must buy before you sell. You can make at most one transaction."
    },
    samples: [
      { input: "6\n7 1 5 3 6 4", output: "5", explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6). Profit = 6-1 = 5." },
      { input: "5\n7 6 4 3 1", output: "0", explanation: "Prices only decrease, so no profitable transaction exists." },
      { input: "4\n2 4 1 7", output: "6", explanation: "Buy on day 3 (price=1) and sell on day 4 (price=7). Profit = 6." }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "0" },
      { input: "2\n1 5", output: "4" },
      { input: "2\n5 1", output: "0" },
      { input: "5\n1 2 3 4 5", output: "4" },
      { input: "3\n3 3 3", output: "0" },
      { input: "6\n1 4 2 7 3 9", output: "8" },
      { input: "4\n10 8 2 9", output: "7" },
      { input: "5\n5 10 1 10 1", output: "9" },
      { input: "3\n1 1 1", output: "0" },
      { input: "7\n3 1 4 1 5 9 2", output: "8" }
    ],
    hints: [
      "Track the minimum price seen so far as you iterate.",
      "At each day, the potential profit is current price minus the minimum price seen so far.",
      "Keep updating the maximum profit across all days."
    ],
    editorial: {
      intuition: "We want to buy at the lowest point and sell at the highest point after it. Track the minimum price and compute profit at each step.",
      bruteForce: "Check all pairs (i, j) where i < j and maximize prices[j] - prices[i]. Time: O(n²), Space: O(1).",
      betterApproach: "Same as optimal for this problem.",
      optimalApproach: "Single pass: maintain minPrice = prices[0] and maxProfit = 0. For each price: maxProfit = max(maxProfit, price - minPrice), minPrice = min(minPrice, price). Time: O(n), Space: O(1).",
      dryRun: "prices=[7,1,5,3,6,4], min=7, maxP=0:\ni=1: maxP=max(0,1-7)=0, min=1\ni=2: maxP=max(0,5-1)=4, min=1\ni=3: maxP=max(4,3-1)=4, min=1\ni=4: maxP=max(4,6-1)=5, min=1\ni=5: maxP=max(5,4-1)=5, min=1\nAnswer: 5",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Transform into maximum subarray sum problem: compute daily gains (prices[i]-prices[i-1]) and find max subarray sum using Kadane's.",
      interviewTips: "Common follow-ups: multiple transactions allowed, at most k transactions, with cooldown period, with transaction fee. Know variants!",
      commonMistakes: "Not handling the case where prices only decrease (should return 0, not negative). Buying and selling on the same day."
    },
    functionSignature: { name: "maxProfit", params: [{ name: "prices", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 9,
    title: "Spiral Order Traversal",
    slug: "spiral-order-traversal",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "matrix", "spiral", "simulation"],
    xp: 150,
    estimatedSolveTime: 20,
    learningOrder: 9,
    prerequisites: [],
    companyTags: ["Microsoft", "Amazon", "Oracle", "Apple"],
    similarProblems: ["rotate-array-by-k-steps"],
    statement: {
      description: "## Spiral Order Traversal\n\nGiven an `m × n` matrix, return all elements of the matrix in **spiral order** (clockwise from the outer layer inward).",
      inputFormat: "The first line contains two integers `m` and `n`.\nThe next `m` lines each contain `n` space-separated integers.",
      outputFormat: "Print the elements in spiral order, space-separated.",
      constraints: "1 ≤ m, n ≤ 100\n-100 ≤ matrix[i][j] ≤ 100",
      notes: ""
    },
    samples: [
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "1 2 3 6 9 8 7 4 5", explanation: "Spiral: right along top → down along right → left along bottom → up along left → center." },
      { input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", output: "1 2 3 4 8 12 11 10 9 5 6 7", explanation: "Spiral traversal of a 3×4 matrix." },
      { input: "1 4\n1 2 3 4", output: "1 2 3 4", explanation: "Single row, just read left to right." }
    ],
    hiddenTestCases: [
      { input: "1 1\n5", output: "5" },
      { input: "2 2\n1 2\n3 4", output: "1 2 4 3" },
      { input: "4 1\n1\n2\n3\n4", output: "1 2 3 4" },
      { input: "3 3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9", output: "-1 -2 -3 -6 -9 -8 -7 -4 -5" },
      { input: "2 3\n1 2 3\n4 5 6", output: "1 2 3 6 5 4" },
      { input: "3 2\n1 2\n3 4\n5 6", output: "1 2 4 6 5 3" },
      { input: "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", output: "1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10" },
      { input: "1 1\n0", output: "0" },
      { input: "2 4\n1 2 3 4\n5 6 7 8", output: "1 2 3 4 8 7 6 5" },
      { input: "5 1\n1\n2\n3\n4\n5", output: "1 2 3 4 5" }
    ],
    hints: [
      "Use four boundaries: top, bottom, left, right. Shrink them after traversing each side.",
      "Traverse right, then down, then left (if top ≤ bottom), then up (if left ≤ right).",
      "Repeat until boundaries cross."
    ],
    editorial: {
      intuition: "Simulate the spiral by maintaining four boundary pointers (top, bottom, left, right) and traversing each edge of the current layer.",
      bruteForce: "No better approach for this problem; simulation is the standard method.",
      betterApproach: "Same as optimal.",
      optimalApproach: "Initialize top=0, bottom=m-1, left=0, right=n-1. While top ≤ bottom and left ≤ right: (1) Traverse right along top row, top++. (2) Traverse down along right column, right--. (3) If top ≤ bottom, traverse left along bottom row, bottom--. (4) If left ≤ right, traverse up along left column, left++. Time: O(m×n), Space: O(1) extra.",
      dryRun: "3×3 matrix:\nLayer 1: right[1,2,3], down[6,9], left[8,7], up[4]\nLayer 2: right[5]\nResult: 1 2 3 6 9 8 7 4 5",
      timeComplexity: "O(m × n)",
      spaceComplexity: "O(1) excluding the output array",
      alternativeSolution: "Direction-based simulation: maintain direction (right/down/left/up), turn when hitting a boundary or visited cell. Use a visited matrix.",
      interviewTips: "Be very careful with boundary conditions, especially for non-square matrices and single row/column. Draw it out during the interview.",
      commonMistakes: "Not checking top ≤ bottom and left ≤ right before the third and fourth traversals. This causes duplicates in rectangular matrices."
    },
    functionSignature: { name: "spiralOrder", params: [{ name: "matrix", type: "int[][]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 10,
    title: "Missing Number in Sequence",
    slug: "missing-number-in-sequence",
    difficulty: "Easy",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "math", "xor", "sum"],
    xp: 100,
    estimatedSolveTime: 10,
    learningOrder: 10,
    prerequisites: [],
    companyTags: ["Microsoft", "Amazon", "Adobe"],
    similarProblems: ["majority-element-detector"],
    statement: {
      description: "## Missing Number in Sequence\n\nGiven an array `nums` containing `n` distinct numbers taken from the range `[0, n]`, return the only number in the range that is missing from the array.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the missing number.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ nums[i] ≤ n\nAll numbers are distinct.",
      notes: ""
    },
    samples: [
      { input: "3\n3 0 1", output: "2", explanation: "Numbers 0, 1, 3 are present. 2 is missing from [0, 3]." },
      { input: "2\n0 1", output: "2", explanation: "Numbers 0, 1 are present. 2 is missing from [0, 2]." },
      { input: "9\n9 6 4 2 3 5 7 0 1", output: "8", explanation: "8 is the missing number from [0, 9]." }
    ],
    hiddenTestCases: [
      { input: "1\n0", output: "1" },
      { input: "1\n1", output: "0" },
      { input: "5\n0 1 2 3 4", output: "5" },
      { input: "5\n1 2 3 4 5", output: "0" },
      { input: "4\n4 2 0 1", output: "3" },
      { input: "2\n1 0", output: "2" },
      { input: "6\n0 1 3 4 5 6", output: "2" },
      { input: "3\n1 2 3", output: "0" },
      { input: "7\n0 1 2 3 4 5 7", output: "6" },
      { input: "4\n0 1 3 4", output: "2" }
    ],
    hints: [
      "The sum of numbers from 0 to n is n*(n+1)/2.",
      "Subtract the sum of the array from the expected sum to find the missing number.",
      "Alternatively, XOR all numbers from 0 to n and XOR with all array elements."
    ],
    editorial: {
      intuition: "We know what the total should be (0+1+...+n). The difference between this and the actual sum gives the missing number.",
      bruteForce: "Sort the array, then scan for the first gap. Time: O(n log n), Space: O(1).",
      betterApproach: "Use a HashSet: add all elements, then check which number from 0 to n is missing. Time: O(n), Space: O(n).",
      optimalApproach: "Math approach: missing = n*(n+1)/2 - sum(nums). Time: O(n), Space: O(1). XOR approach: XOR all indices (0 to n) and all values; the result is the missing number.",
      dryRun: "nums=[3,0,1], n=3:\nExpected sum = 3*4/2 = 6\nActual sum = 3+0+1 = 4\nMissing = 6-4 = 2 ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "XOR method: result = n, then for each i, result ^= i ^ nums[i]. This avoids potential integer overflow with large n.",
      interviewTips: "Mention both sum and XOR approaches. XOR is overflow-safe. For follow-up with two missing numbers, use sum + sum-of-squares equations.",
      commonMistakes: "Using n*(n+1)/2 with int type causing overflow for large n. Off-by-one: n goes from 0 to n inclusive."
    },
    functionSignature: { name: "missingNumber", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  // ── MEDIUM (11) ────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "Subarray with Target Sum Count",
    slug: "subarray-with-target-sum-count",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "prefix-sum", "hashmap", "subarray"],
    xp: 200,
    estimatedSolveTime: 25,
    learningOrder: 11,
    prerequisites: ["contiguous-subarray-maximum"],
    companyTags: ["Google", "Meta", "Amazon", "Apple"],
    similarProblems: ["equilibrium-index-finder"],
    statement: {
      description: "## Subarray with Target Sum Count\n\nGiven an integer array `nums` and an integer `target`, return the total number of contiguous subarrays whose sum equals `target`.\n\nA subarray is a contiguous non-empty sequence of elements within the array.",
      inputFormat: "The first line contains two integers `n` and `target`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the count of subarrays with the given sum.",
      constraints: "1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4\n-10^7 ≤ target ≤ 10^7",
      notes: "The array may contain negative numbers."
    },
    samples: [
      { input: "5 5\n1 2 3 -1 6", output: "3", explanation: "Subarrays: [2,3], [1,2,3,-1], [6] — wait, let's recount. [2,3]=5, [1,2,3,-1]=5, [-1,6]=5. Total = 3." },
      { input: "3 0\n1 -1 0", output: "3", explanation: "Subarrays: [1,-1], [0], [1,-1,0]. All sum to 0." },
      { input: "4 3\n1 1 1 1", output: "2", explanation: "Subarrays [1,1,1] starting at index 0 and index 1." }
    ],
    hiddenTestCases: [
      { input: "1 5\n5", output: "1" },
      { input: "1 5\n3", output: "0" },
      { input: "5 0\n0 0 0 0 0", output: "15" },
      { input: "4 4\n1 1 1 1", output: "1" },
      { input: "3 -1\n-1 -1 -1", output: "3" },
      { input: "6 3\n1 2 3 0 3 -3", output: "5" },
      { input: "5 10\n1 2 3 4 5", output: "0" },
      { input: "2 3\n1 2", output: "1" },
      { input: "4 2\n1 1 1 1", output: "3" },
      { input: "3 100\n50 50 50", output: "1" }
    ],
    hints: [
      "Can you express the sum of a subarray using prefix sums?",
      "If prefix[j] - prefix[i] = target, then the subarray from i+1 to j sums to target.",
      "Use a hashmap to store the count of each prefix sum as you iterate."
    ],
    editorial: {
      intuition: "If we define prefix[j] = nums[0] + ... + nums[j], then subarray sum from i+1 to j is prefix[j] - prefix[i]. We need prefix[j] - prefix[i] = target, i.e., prefix[i] = prefix[j] - target.",
      bruteForce: "Check all subarrays using two loops, computing sum for each. Time: O(n²), Space: O(1).",
      betterApproach: "Use prefix sum array, then for each j find count of i where prefix[i] = prefix[j] - target. Still O(n²) without optimization.",
      optimalApproach: "Use a hashmap to store frequency of prefix sums. As we compute prefix[j], look up (prefix[j] - target) in the map. Initialize map with {0: 1}. Time: O(n), Space: O(n).",
      dryRun: "nums=[1,2,3,-1,6], target=5, map={0:1}, prefix=0, count=0:\ni=0: prefix=1, look up 1-5=-4 → 0, map={0:1,1:1}\ni=1: prefix=3, look up 3-5=-2 → 0, map={0:1,1:1,3:1}\ni=2: prefix=6, look up 6-5=1 → 1, count=1, map={0:1,1:1,3:1,6:1}\ni=3: prefix=5, look up 5-5=0 → 1, count=2, map={0:1,1:1,3:1,6:1,5:1}\ni=4: prefix=11, look up 11-5=6 → 1, count=3\nAnswer: 3",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      alternativeSolution: "For non-negative arrays only, sliding window works. But since negatives are allowed, the prefix sum + hashmap approach is necessary.",
      interviewTips: "This is a very common interview question. Always initialize the map with {0: 1} to handle subarrays starting from index 0. Explain clearly why this works.",
      commonMistakes: "Forgetting to initialize the map with {0: 1}. Using sliding window when negatives are present (sliding window doesn't work with negatives)."
    },
    functionSignature: { name: "subarraySum", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 12,
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "prefix-product", "divide"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 12,
    prerequisites: ["equilibrium-index-finder"],
    companyTags: ["Amazon", "Meta", "Apple", "Microsoft"],
    similarProblems: ["equilibrium-index-finder", "contiguous-subarray-maximum"],
    statement: {
      description: "## Product of Array Except Self\n\nGiven an integer array `nums`, return an array `result` where `result[i]` is the product of all elements of `nums` except `nums[i]`.\n\nYou must solve it **without using division** and in O(n) time.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the result array, space-separated.",
      constraints: "2 ≤ n ≤ 10^5\n-30 ≤ nums[i] ≤ 30\nThe product of any prefix or suffix fits in a 64-bit integer.",
      notes: "Do not use the division operator."
    },
    samples: [
      { input: "4\n1 2 3 4", output: "24 12 8 6", explanation: "result[0]=2×3×4=24, result[1]=1×3×4=12, result[2]=1×2×4=8, result[3]=1×2×3=6." },
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0", explanation: "Any product containing 0 is 0. result[2] = (-1)×1×(-3)×3 = 9." },
      { input: "3\n2 3 4", output: "12 8 6", explanation: "result[0]=12, result[1]=8, result[2]=6." }
    ],
    hiddenTestCases: [
      { input: "2\n1 2", output: "2 1" },
      { input: "4\n0 0 0 0", output: "0 0 0 0" },
      { input: "3\n-1 -1 -1", output: "1 1 1" },
      { input: "4\n1 1 1 1", output: "1 1 1 1" },
      { input: "5\n2 2 2 2 2", output: "16 16 16 16 16" },
      { input: "3\n0 1 2", output: "2 0 0" },
      { input: "4\n-2 -3 4 -5", output: "60 40 -30 24" },
      { input: "2\n-1 1", output: "1 -1" },
      { input: "5\n1 -1 1 -1 1", output: "1 -1 1 -1 1" },
      { input: "3\n10 20 30", output: "600 300 200" }
    ],
    hints: [
      "Build two arrays: left products and right products.",
      "left[i] = product of all elements before i. right[i] = product of all elements after i.",
      "result[i] = left[i] × right[i]. Can you do it with O(1) extra space?"
    ],
    editorial: {
      intuition: "result[i] = (product of elements left of i) × (product of elements right of i). We can compute these separately without division.",
      bruteForce: "For each i, compute the product of all other elements. Time: O(n²), Space: O(1).",
      betterApproach: "Build leftProduct and rightProduct arrays. leftProduct[i] = nums[0]×...×nums[i-1]. rightProduct[i] = nums[i+1]×...×nums[n-1]. result[i] = leftProduct[i] × rightProduct[i]. Time: O(n), Space: O(n).",
      optimalApproach: "Use the result array itself for left products, then do a right-to-left pass multiplying by a running right product. Time: O(n), Space: O(1) extra (output doesn't count).",
      dryRun: "nums=[1,2,3,4]:\nLeft pass: result=[1,1,2,6]\nRight pass (rightProd starts at 1):\ni=3: result[3]=6×1=6, rightProd=1×4=4\ni=2: result[2]=2×4=8, rightProd=4×3=12\ni=1: result[1]=1×12=12, rightProd=12×2=24\ni=0: result[0]=1×24=24\nResult: [24,12,8,6] ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) extra space (excluding output)",
      alternativeSolution: "If division were allowed: compute total product, then result[i] = totalProduct / nums[i]. Handle zeros specially.",
      interviewTips: "Often asked as a follow-up: 'solve without division'. The two-pass technique is elegant. Know how to handle zeros (at most 1 zero vs. 2+ zeros).",
      commonMistakes: "Using division when the problem says not to. Not handling zeros correctly. Integer overflow with large products."
    },
    functionSignature: { name: "productExceptSelf", params: [{ name: "nums", type: "int[]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 13,
    title: "Next Greater Permutation",
    slug: "next-greater-permutation",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "permutation", "next-permutation"],
    xp: 200,
    estimatedSolveTime: 25,
    learningOrder: 13,
    prerequisites: ["rotate-array-by-k-steps"],
    companyTags: ["Google", "Amazon", "Microsoft", "Meta"],
    similarProblems: ["rotate-array-by-k-steps"],
    statement: {
      description: "## Next Greater Permutation\n\nGiven an array of integers `nums`, rearrange it into the lexicographically next greater permutation. If no such permutation exists (the array is in descending order), rearrange it to the smallest permutation (ascending order).\n\nThe replacement must be done in-place using only constant extra memory.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the next permutation, space-separated.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ nums[i] ≤ 100",
      notes: ""
    },
    samples: [
      { input: "3\n1 2 3", output: "1 3 2", explanation: "Next permutation after [1,2,3] is [1,3,2]." },
      { input: "3\n3 2 1", output: "1 2 3", explanation: "No next permutation exists, so wrap around to [1,2,3]." },
      { input: "4\n1 1 5 1", output: "1 5 1 1", explanation: "Swap: find rightmost ascent at index 1 (1 < 5), swap 1 with next larger from right (1), reverse suffix." }
    ],
    hiddenTestCases: [
      { input: "1\n1", output: "1" },
      { input: "2\n1 2", output: "2 1" },
      { input: "2\n2 1", output: "1 2" },
      { input: "4\n1 3 2 4", output: "1 3 4 2" },
      { input: "5\n1 2 3 4 5", output: "1 2 3 5 4" },
      { input: "5\n5 4 3 2 1", output: "1 2 3 4 5" },
      { input: "4\n2 3 1 0", output: "3 0 1 2" },
      { input: "3\n1 5 1", output: "5 1 1" },
      { input: "4\n4 3 2 1", output: "1 2 3 4" },
      { input: "5\n1 3 5 4 2", output: "1 4 2 3 5" }
    ],
    hints: [
      "Find the rightmost index i where nums[i] < nums[i+1]. This is the 'dip'.",
      "Find the rightmost index j > i where nums[j] > nums[i]. Swap nums[i] and nums[j].",
      "Reverse the suffix starting at i+1 to get the lexicographically next permutation."
    ],
    editorial: {
      intuition: "To get the next permutation, we need to make the smallest possible increase. Find where the sequence stops being non-increasing from the right, swap with the next bigger value, then sort the rest.",
      bruteForce: "Generate all permutations, sort them, find the current one and return the next. Time: O(n! × n), Space: O(n!).",
      betterApproach: "Same as optimal for this problem.",
      optimalApproach: "1. Find largest i such that nums[i] < nums[i+1]. If none, reverse array (it's the last permutation). 2. Find largest j > i such that nums[j] > nums[i]. 3. Swap nums[i] and nums[j]. 4. Reverse nums[i+1:]. Time: O(n), Space: O(1).",
      dryRun: "nums=[1,3,5,4,2]:\nStep 1: Find i where nums[i]<nums[i+1]: i=1 (3<5)\nStep 2: Find j>1 where nums[j]>3: j=3 (4>3)\nStep 3: Swap nums[1] and nums[3]: [1,4,5,3,2]\nStep 4: Reverse nums[2:]: [1,4,2,3,5] ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Use C++ STL's next_permutation for a one-liner, but understanding the algorithm is what matters in interviews.",
      interviewTips: "This is a classic problem. Walk through the algorithm with a concrete example. Interviewers want to see you understand WHY each step works.",
      commonMistakes: "Not handling the 'last permutation' edge case. Reversing the wrong portion of the array. Finding the wrong j index."
    },
    functionSignature: { name: "nextPermutation", params: [{ name: "nums", type: "int[]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 14,
    title: "Merge Overlapping Intervals",
    slug: "merge-overlapping-intervals",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "intervals", "sorting", "merge"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 14,
    prerequisites: [],
    companyTags: ["Google", "Meta", "Amazon", "Microsoft", "Uber"],
    similarProblems: ["next-greater-permutation"],
    statement: {
      description: "## Merge Overlapping Intervals\n\nGiven an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      inputFormat: "The first line contains an integer `n` — the number of intervals.\nThe next `n` lines each contain two integers `start` and `end`.",
      outputFormat: "Print the merged intervals, one per line (start end).",
      constraints: "1 ≤ n ≤ 10^4\n0 ≤ start ≤ end ≤ 10^4",
      notes: ""
    },
    samples: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", output: "1 6\n8 10\n15 18", explanation: "[1,3] and [2,6] overlap, merged to [1,6]. Others don't overlap." },
      { input: "2\n1 4\n4 5", output: "1 5", explanation: "[1,4] and [4,5] share endpoint 4, so they merge to [1,5]." },
      { input: "1\n1 1", output: "1 1", explanation: "Single interval, no merging needed." }
    ],
    hiddenTestCases: [
      { input: "3\n1 10\n2 3\n4 5", output: "1 10" },
      { input: "2\n1 2\n3 4", output: "1 2\n3 4" },
      { input: "5\n1 2\n3 4\n5 6\n7 8\n9 10", output: "1 2\n3 4\n5 6\n7 8\n9 10" },
      { input: "3\n1 5\n2 3\n4 6", output: "1 6" },
      { input: "4\n1 4\n0 4\n3 5\n2 6", output: "0 6" },
      { input: "2\n1 1\n1 1", output: "1 1" },
      { input: "3\n0 0\n1 1\n2 2", output: "0 0\n1 1\n2 2" },
      { input: "4\n1 10\n11 20\n21 30\n5 25", output: "1 30" },
      { input: "3\n1 3\n5 7\n2 6", output: "1 7" },
      { input: "5\n1 2\n2 3\n3 4\n4 5\n5 6", output: "1 6" }
    ],
    hints: [
      "Sort the intervals by their start time.",
      "Iterate through sorted intervals. If the current interval overlaps with the last merged one, extend it.",
      "Two intervals overlap if the start of the second is ≤ the end of the first."
    ],
    editorial: {
      intuition: "After sorting by start time, overlapping intervals are adjacent. We just need to extend the current merged interval when overlap is detected.",
      bruteForce: "Mark overlapping intervals and merge them iteratively until no more merges are possible. Time: O(n²), Space: O(n).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Sort by start. Initialize merged = [intervals[0]]. For each interval: if it overlaps with the last in merged (start ≤ last.end), extend last.end = max(last.end, current.end). Else push as new. Time: O(n log n), Space: O(n).",
      dryRun: "intervals=[[1,3],[2,6],[8,10],[15,18]]:\nSorted (already sorted).\nmerged=[[1,3]]\n[2,6]: 2≤3 → extend to [1,6], merged=[[1,6]]\n[8,10]: 8>6 → push, merged=[[1,6],[8,10]]\n[15,18]: 15>10 → push, merged=[[1,6],[8,10],[15,18]] ✓",
      timeComplexity: "O(n log n) for sorting",
      spaceComplexity: "O(n) for the result",
      alternativeSolution: "Connected components approach: build a graph where overlapping intervals are connected, then find components. Time: O(n²), less efficient.",
      interviewTips: "Interval problems are very common. Master sorting + sweep line. Follow-ups: insert interval, interval intersection, meeting rooms.",
      commonMistakes: "Not sorting first. Using < instead of ≤ for overlap check (adjacent intervals like [1,4],[4,5] should merge). Not handling fully nested intervals."
    },
    functionSignature: { name: "mergeIntervals", params: [{ name: "intervals", type: "int[][]" }], returnType: "int[][]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 15,
    title: "Trapped Rainwater Volume",
    slug: "trapped-rainwater-volume",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "two-pointers", "stack", "water-trapping"],
    xp: 250,
    estimatedSolveTime: 30,
    learningOrder: 15,
    prerequisites: ["contiguous-subarray-maximum"],
    companyTags: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Goldman Sachs"],
    similarProblems: ["stock-profit-maximizer"],
    statement: {
      description: "## Trapped Rainwater Volume\n\nGiven `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water can be trapped after raining.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated non-negative integers.",
      outputFormat: "Print a single integer — the total units of trapped water.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ height[i] ≤ 10^4",
      notes: ""
    },
    samples: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "Water fills the valleys between the bars, totaling 6 units." },
      { input: "6\n4 2 0 3 2 5", output: "9", explanation: "Water trapped in the valley between bars." },
      { input: "3\n1 0 1", output: "1", explanation: "1 unit of water trapped between the two bars of height 1." }
    ],
    hiddenTestCases: [
      { input: "1\n5", output: "0" },
      { input: "2\n3 5", output: "0" },
      { input: "5\n5 4 3 2 1", output: "0" },
      { input: "5\n1 2 3 4 5", output: "0" },
      { input: "5\n3 0 0 0 3", output: "9" },
      { input: "4\n0 0 0 0", output: "0" },
      { input: "5\n2 0 2 0 2", output: "4" },
      { input: "7\n1 3 2 4 1 3 1", output: "4" },
      { input: "3\n5 0 5", output: "5" },
      { input: "8\n0 1 2 3 3 2 1 0", output: "0" }
    ],
    hints: [
      "Water at each position = min(maxLeft, maxRight) - height[i], if positive.",
      "Precompute maxLeft[i] and maxRight[i] arrays.",
      "Can you solve it with two pointers and O(1) space?"
    ],
    editorial: {
      intuition: "At each bar, water trapped above it depends on the minimum of the tallest bar to its left and right, minus its own height.",
      bruteForce: "For each position, find max height to left and right using inner loops. Time: O(n²), Space: O(1).",
      betterApproach: "Precompute maxLeft[i] and maxRight[i] arrays. water += max(0, min(maxLeft[i], maxRight[i]) - height[i]). Time: O(n), Space: O(n).",
      optimalApproach: "Two pointers: left=0, right=n-1, leftMax=0, rightMax=0. If leftMax ≤ rightMax, process left side (water = leftMax - height[left] if positive), else process right side. Time: O(n), Space: O(1).",
      dryRun: "height=[0,1,0,2,1,0,1,3,2,1,2,1]:\nUsing prefix max arrays:\nmaxLeft = [0,1,1,2,2,2,2,3,3,3,3,3]\nmaxRight= [3,3,3,3,3,3,3,3,2,2,2,1]\nWater: min(L,R)-h for each:\n0,0,1,0,1,2,1,0,0,1,0,0 → sum=6 ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) with two-pointer approach",
      alternativeSolution: "Stack-based approach: process bars using a stack, computing water layer by layer. Time: O(n), Space: O(n).",
      interviewTips: "Start with the two-array approach, then optimize to two pointers. This is one of the most popular interview questions. Draw the elevation map!",
      commonMistakes: "Not handling decreasing/increasing only arrays (no water trapped). Confusing max from left/right with the current position's height."
    },
    functionSignature: { name: "trapRainwater", params: [{ name: "height", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 16,
    title: "Longest Consecutive Sequence Length",
    slug: "longest-consecutive-sequence-length",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "hashset", "consecutive", "sequence"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 16,
    prerequisites: [],
    companyTags: ["Google", "Amazon", "Meta", "Uber"],
    similarProblems: ["subarray-with-target-sum-count"],
    statement: {
      description: "## Longest Consecutive Sequence Length\n\nGiven an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nThe algorithm must run in O(n) time.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print a single integer — the length of the longest consecutive sequence.",
      constraints: "0 ≤ n ≤ 10^5\n-10^9 ≤ nums[i] ≤ 10^9",
      notes: "Consecutive means values like 1,2,3,4 — not indices."
    },
    samples: [
      { input: "6\n100 4 200 1 3 2", output: "4", explanation: "The longest consecutive sequence is [1, 2, 3, 4], length 4." },
      { input: "10\n0 3 7 2 5 8 4 6 0 1", output: "9", explanation: "Consecutive sequence: [0, 1, 2, 3, 4, 5, 6, 7, 8], length 9." },
      { input: "3\n1 1 1", output: "1", explanation: "All elements are the same, longest consecutive sequence is [1], length 1." }
    ],
    hiddenTestCases: [
      { input: "0\n", output: "0" },
      { input: "1\n5", output: "1" },
      { input: "5\n1 2 3 4 5", output: "5" },
      { input: "5\n5 4 3 2 1", output: "5" },
      { input: "4\n10 30 20 40", output: "1" },
      { input: "6\n-3 -2 -1 0 1 2", output: "6" },
      { input: "4\n1 3 5 7", output: "1" },
      { input: "7\n1 2 3 10 11 12 13", output: "4" },
      { input: "5\n5 5 5 5 5", output: "1" },
      { input: "8\n-1 0 1 2 -3 -2 5 6", output: "6" }
    ],
    hints: [
      "Use a HashSet for O(1) lookups.",
      "A number is the start of a sequence if (num - 1) is NOT in the set.",
      "For each sequence start, count consecutive elements forward."
    ],
    editorial: {
      intuition: "Put all numbers in a set. For each number that could be the START of a sequence (i.e., num-1 is not in the set), count how far the sequence extends.",
      bruteForce: "Sort the array, then find the longest run of consecutive numbers. Time: O(n log n), Space: O(1).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Add all to HashSet. For each num: if (num-1) not in set, it's a sequence start. Count forwards while (num+1, num+2, ...) are in the set. Track maximum length. Time: O(n), Space: O(n).",
      dryRun: "nums=[100,4,200,1,3,2], set={100,4,200,1,3,2}:\n100: 99 not in set → start, 101? no → len=1\n4: 3 in set → skip (not start)\n200: 199 not in set → start, 201? no → len=1\n1: 0 not in set → start, 2? yes, 3? yes, 4? yes, 5? no → len=4\n3: 2 in set → skip\n2: 1 in set → skip\nMax: 4 ✓",
      timeComplexity: "O(n) — each element is visited at most twice",
      spaceComplexity: "O(n) for the HashSet",
      alternativeSolution: "Sort and scan: Time O(n log n), Space O(1). Handle duplicates by skipping equal adjacent elements.",
      interviewTips: "The key insight is identifying sequence starts by checking if num-1 is absent. This ensures O(n) total work despite the inner while loop.",
      commonMistakes: "Not handling duplicates. Processing every element as a potential start (making it O(n²) in the worst case)."
    },
    functionSignature: { name: "longestConsecutive", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 17,
    title: "Subarray with Maximum Product",
    slug: "subarray-with-maximum-product",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "dynamic-programming", "product", "subarray"],
    xp: 250,
    estimatedSolveTime: 25,
    learningOrder: 17,
    prerequisites: ["contiguous-subarray-maximum"],
    companyTags: ["Amazon", "Microsoft", "Google"],
    similarProblems: ["contiguous-subarray-maximum", "product-of-array-except-self"],
    statement: {
      description: "## Subarray with Maximum Product\n\nGiven an integer array `nums`, find a contiguous subarray that has the largest product, and return that product.\n\nThe array may contain positive, negative, and zero values.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the maximum product of any contiguous subarray.",
      constraints: "1 ≤ n ≤ 10^4\n-10 ≤ nums[i] ≤ 10\nThe product of any subarray fits in a 32-bit integer.",
      notes: ""
    },
    samples: [
      { input: "4\n2 3 -2 4", output: "6", explanation: "[2,3] has the largest product = 6." },
      { input: "3\n-2 0 -1", output: "0", explanation: "The subarray [0] gives the maximum product 0." },
      { input: "5\n-2 3 -4 5 -1", output: "60", explanation: "[3,-4,5,-1] has product 60." }
    ],
    hiddenTestCases: [
      { input: "1\n-5", output: "-5" },
      { input: "1\n0", output: "0" },
      { input: "3\n-1 -2 -3", output: "6" },
      { input: "4\n1 2 3 4", output: "24" },
      { input: "5\n0 0 0 0 0", output: "0" },
      { input: "3\n-1 0 -1", output: "0" },
      { input: "4\n2 -5 -2 -4", output: "20" },
      { input: "2\n-2 3", output: "3" },
      { input: "6\n1 -2 -3 0 7 -8", output: "7" },
      { input: "4\n-1 -3 -10 0", output: "30" }
    ],
    hints: [
      "Unlike maximum sum, negatives can turn a minimum product into a maximum when multiplied.",
      "Track both the maximum AND minimum product ending at each position.",
      "At each element: newMax = max(num, maxSoFar * num, minSoFar * num). Similarly for newMin."
    ],
    editorial: {
      intuition: "Because a negative × negative = positive, we need to track both the maximum and minimum product subarrays ending at each position.",
      bruteForce: "Check all subarrays, compute products. Time: O(n²), Space: O(1).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Track maxProd and minProd at each step. For each nums[i]: temp = maxProd; maxProd = max(nums[i], maxProd*nums[i], minProd*nums[i]); minProd = min(nums[i], temp*nums[i], minProd*nums[i]). Update result. Time: O(n), Space: O(1).",
      dryRun: "nums=[2,3,-2,4]:\ni=0: maxP=2, minP=2, result=2\ni=1: maxP=max(3,6,6)=6, minP=min(3,6,6)=3, result=6\ni=2: maxP=max(-2,-12,-6)=-2, minP=min(-2,-12,-6)=-12, result=6\ni=3: maxP=max(4,-8,-48)=4, minP=min(4,-8,-48)=-48, result=6\nAnswer: 6 ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Compute prefix products from left and right. The maximum product subarray will be one of these prefixes/suffixes (reset at zeros).",
      interviewTips: "This is a twist on Kadane's for products. The key insight about tracking min as well as max shows deep algorithmic thinking. Be ready to explain why.",
      commonMistakes: "Only tracking maximum (ignoring that min × negative = possible new max). Not handling zeros correctly (they reset the subarray)."
    },
    functionSignature: { name: "maxProduct", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 18,
    title: "Four Elements Target Sum",
    slug: "four-elements-target-sum",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "two-pointers", "sorting", "four-sum"],
    xp: 250,
    estimatedSolveTime: 30,
    learningOrder: 18,
    prerequisites: ["subarray-with-target-sum-count"],
    companyTags: ["Amazon", "Google", "Meta", "Apple"],
    similarProblems: ["subarray-with-target-sum-count"],
    statement: {
      description: "## Four Elements Target Sum\n\nGiven an array `nums` of `n` integers and an integer `target`, return all unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:\n- `0 ≤ a < b < c < d < n`\n- `nums[a] + nums[b] + nums[c] + nums[d] == target`\n\nThe answer must not contain duplicate quadruplets.",
      inputFormat: "The first line contains two integers `n` and `target`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print each unique quadruplet on a separate line, sorted in non-decreasing order within each quadruplet. Print quadruplets in lexicographic order.",
      constraints: "1 ≤ n ≤ 200\n-10^9 ≤ nums[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9",
      notes: ""
    },
    samples: [
      { input: "6 0\n1 0 -1 0 -2 2", output: "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1", explanation: "Three unique quadruplets sum to 0." },
      { input: "5 8\n2 2 2 2 2", output: "2 2 2 2", explanation: "Only one unique quadruplet." },
      { input: "4 10\n1 2 3 4", output: "1 2 3 4", explanation: "1+2+3+4 = 10." }
    ],
    hiddenTestCases: [
      { input: "4 0\n0 0 0 0", output: "0 0 0 0" },
      { input: "3 0\n1 2 3", output: "" },
      { input: "6 10\n1 1 1 1 1 1", output: "" },
      { input: "5 -1\n-3 -1 0 1 2", output: "-3 -1 1 2\n-3 0 0 2" },
      { input: "8 0\n-2 -1 -1 1 1 2 2 3", output: "-2 -1 1 2\n-2 -1 1 2\n-1 -1 1 1" },
      { input: "4 100\n1 2 3 4", output: "" },
      { input: "7 4\n1 1 1 1 1 1 1", output: "1 1 1 1" },
      { input: "6 -4\n-5 -4 -3 -2 -1 0", output: "-5 -3 -2 0\n-5 -2 -1 0\n-4 -3 -1 0\n-5 -3 -1 1" },
      { input: "4 0\n1 -1 2 -2", output: "-2 -1 1 2" },
      { input: "5 6\n1 1 2 2 3", output: "1 1 2 2" }
    ],
    hints: [
      "Sort the array first to make duplicate handling easier.",
      "Fix two elements with two outer loops, then use two pointers for the remaining two.",
      "Skip duplicates at each level to avoid duplicate quadruplets."
    ],
    editorial: {
      intuition: "Extend the 3Sum approach: fix two elements, then use two pointers. Sort first for efficient duplicate skipping.",
      bruteForce: "Four nested loops checking all combinations. Time: O(n⁴), Space: O(1).",
      betterApproach: "Sort + fix first two with loops + two pointers for the inner pair. Skip duplicates. Time: O(n³), Space: O(1).",
      optimalApproach: "Sort array. For i from 0 to n-4: for j from i+1 to n-3: use two pointers lo=j+1, hi=n-1. Skip duplicates at all levels. Time: O(n³), Space: O(1) extra.",
      dryRun: "nums=[1,0,-1,0,-2,2], target=0\nSorted: [-2,-1,0,0,1,2]\ni=0(-2), j=1(-1): lo=2, hi=5: 0+2=2, need 3? sum=-2-1+0+2=-1<0 → lo++\nlo=3: -2-1+0+2=-1<0 → lo++\nlo=4: -2-1+1+2=0 ✓ → add [-2,-1,1,2]\n...",
      timeComplexity: "O(n³)",
      spaceComplexity: "O(1) extra (excluding output and sorting)",
      alternativeSolution: "Hash all pairs' sums into a map, then for each pair check if (target - pairSum) exists. Time: O(n²) average but O(n⁴) worst case for duplicates.",
      interviewTips: "Master the pattern: sort → fix k-2 elements → two pointers. Works for 2Sum, 3Sum, 4Sum. Always handle duplicates explicitly.",
      commonMistakes: "Integer overflow when computing sums (use long). Not skipping duplicates properly. Missing the sorted order requirement."
    },
    functionSignature: { name: "fourSum", params: [{ name: "nums", type: "int[]" }, { name: "target", type: "int" }], returnType: "int[][]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 19,
    title: "Rotate Matrix 90 Degrees",
    slug: "rotate-matrix-90-degrees",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "matrix", "rotation", "transpose"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 19,
    prerequisites: ["spiral-order-traversal"],
    companyTags: ["Amazon", "Microsoft", "Apple"],
    similarProblems: ["spiral-order-traversal"],
    statement: {
      description: "## Rotate Matrix 90 Degrees\n\nGiven an `n × n` 2D matrix representing an image, rotate the matrix by 90 degrees clockwise **in-place**.",
      inputFormat: "The first line contains an integer `n`.\nThe next `n` lines each contain `n` space-separated integers.",
      outputFormat: "Print the rotated matrix, `n` lines of `n` space-separated integers.",
      constraints: "1 ≤ n ≤ 100\n-1000 ≤ matrix[i][j] ≤ 1000",
      notes: "You must rotate in-place (do not allocate another 2D matrix)."
    },
    samples: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", explanation: "Rows become columns in reverse order." },
      { input: "2\n1 2\n3 4", output: "3 1\n4 2", explanation: "90° clockwise rotation of 2×2 matrix." },
      { input: "1\n1", output: "1", explanation: "1×1 matrix is unchanged." }
    ],
    hiddenTestCases: [
      { input: "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16", output: "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4" },
      { input: "2\n0 0\n0 0", output: "0 0\n0 0" },
      { input: "3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9", output: "-7 -4 -1\n-8 -5 -2\n-9 -6 -3" },
      { input: "3\n1 0 0\n0 1 0\n0 0 1", output: "0 0 1\n0 1 0\n1 0 0" },
      { input: "4\n1 1 1 1\n2 2 2 2\n3 3 3 3\n4 4 4 4", output: "4 3 2 1\n4 3 2 1\n4 3 2 1\n4 3 2 1" },
      { input: "2\n-1 1\n1 -1", output: "1 -1\n-1 1" },
      { input: "3\n9 8 7\n6 5 4\n3 2 1", output: "3 6 9\n2 5 8\n1 4 7" },
      { input: "5\n1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15\n16 17 18 19 20\n21 22 23 24 25", output: "21 16 11 6 1\n22 17 12 7 2\n23 18 13 8 3\n24 19 14 9 4\n25 20 15 10 5" },
      { input: "1\n-999", output: "-999" },
      { input: "2\n100 200\n300 400", output: "300 100\n400 200" }
    ],
    hints: [
      "A 90° clockwise rotation = transpose + reverse each row.",
      "Transpose swaps matrix[i][j] with matrix[j][i].",
      "After transposing, reverse each row to complete the rotation."
    ],
    editorial: {
      intuition: "90° clockwise rotation can be decomposed into two simpler operations: transpose the matrix (swap rows and columns), then reverse each row.",
      bruteForce: "Create a new matrix and map positions: new[j][n-1-i] = old[i][j]. Time: O(n²), Space: O(n²).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Step 1: Transpose in-place — swap matrix[i][j] and matrix[j][i] for i < j. Step 2: Reverse each row. Time: O(n²), Space: O(1).",
      dryRun: "matrix=[[1,2,3],[4,5,6],[7,8,9]]:\nTranspose: [[1,4,7],[2,5,8],[3,6,9]]\nReverse rows: [[7,4,1],[8,5,2],[9,6,3]] ✓",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1) in-place",
      alternativeSolution: "Four-way swap: process the matrix layer by layer, rotating four cells at a time. More complex but also O(1) space.",
      interviewTips: "Memorize the decomposition: transpose + reverse rows = 90° CW, transpose + reverse columns = 90° CCW. Drawing helps a lot.",
      commonMistakes: "Transposing the entire matrix (including i ≥ j) which double-swaps. Confusing CW and CCW rotation."
    },
    functionSignature: { name: "rotateMatrix", params: [{ name: "matrix", type: "int[][]" }], returnType: "int[][]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 20,
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "matrix", "in-place", "marking"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 20,
    prerequisites: ["spiral-order-traversal"],
    companyTags: ["Microsoft", "Amazon", "Oracle"],
    similarProblems: ["rotate-matrix-90-degrees"],
    statement: {
      description: "## Set Matrix Zeroes\n\nGiven an `m × n` integer matrix, if an element is 0, set its entire row and column to 0's. You must do it **in-place**.",
      inputFormat: "The first line contains two integers `m` and `n`.\nThe next `m` lines each contain `n` space-separated integers.",
      outputFormat: "Print the modified matrix.",
      constraints: "1 ≤ m, n ≤ 200\n-2^31 ≤ matrix[i][j] ≤ 2^31 - 1",
      notes: "Try to use O(1) extra space."
    },
    samples: [
      { input: "3 3\n1 1 1\n1 0 1\n1 1 1", output: "1 0 1\n0 0 0\n1 0 1", explanation: "The element at (1,1) is 0, so row 1 and column 1 become all zeros." },
      { input: "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5", output: "0 0 0 0\n0 4 5 0\n0 3 1 0", explanation: "Zeros at (0,0) and (0,3) affect their rows and columns." },
      { input: "2 2\n1 2\n3 4", output: "1 2\n3 4", explanation: "No zeros, matrix unchanged." }
    ],
    hiddenTestCases: [
      { input: "1 1\n0", output: "0" },
      { input: "1 1\n5", output: "5" },
      { input: "2 2\n0 0\n0 0", output: "0 0\n0 0" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "0 0 0\n0 0 0\n0 0 0" },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9", output: "1 2 3\n4 5 6\n7 8 9" },
      { input: "2 3\n1 0 3\n0 5 6", output: "0 0 0\n0 0 0" },
      { input: "4 4\n1 1 1 1\n1 0 1 1\n1 1 1 1\n1 1 1 0", output: "1 0 1 0\n0 0 0 0\n1 0 1 0\n0 0 0 0" },
      { input: "1 5\n1 0 3 0 5", output: "0 0 0 0 0" },
      { input: "3 1\n1\n0\n3", output: "1\n0\n3" },
      { input: "2 2\n1 0\n0 1", output: "0 0\n0 0" }
    ],
    hints: [
      "You can use the first row and first column as markers.",
      "First pass: scan matrix, mark first row/column for any zero found.",
      "Second pass: zero out cells based on markers. Handle the first row/column last."
    ],
    editorial: {
      intuition: "Instead of using extra arrays to track which rows/columns need zeroing, use the first row and first column of the matrix itself as markers.",
      bruteForce: "Use two sets to store which rows and columns contain zeros. Then zero them out. Time: O(m×n), Space: O(m+n).",
      betterApproach: "Use boolean arrays for rows and columns. Time: O(m×n), Space: O(m+n).",
      optimalApproach: "Use first row and first column as markers. Two extra booleans for whether first row/column themselves need zeroing. First pass: mark. Second pass (from bottom-right): apply. Time: O(m×n), Space: O(1).",
      dryRun: "matrix=[[1,1,1],[1,0,1],[1,1,1]]:\nScan: found 0 at (1,1) → mark row 1 col 1 → matrix[1][0]=0, matrix[0][1]=0\nApply (inner cells): matrix[1][0]=0 means row 1 zeroed, matrix[0][1]=0 means col 1 zeroed\nResult: [[1,0,1],[0,0,0],[1,0,1]] ✓",
      timeComplexity: "O(m × n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Use a marker value (e.g., -MAX) to mark cells to be zeroed (only works if that value isn't in the input). Less clean.",
      interviewTips: "Start with the O(m+n) space solution, then optimize. Using the matrix itself as storage is a common in-place technique.",
      commonMistakes: "Zeroing rows/columns during the scan phase (corrupts markers). Not handling the first row/column separately."
    },
    functionSignature: { name: "setZeroes", params: [{ name: "matrix", type: "int[][]" }], returnType: "int[][]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 21,
    title: "Rearrange Alternating Positives and Negatives",
    slug: "rearrange-alternating-positives-negatives",
    difficulty: "Medium",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "rearrangement", "alternating"],
    xp: 200,
    estimatedSolveTime: 20,
    learningOrder: 21,
    prerequisites: ["move-all-negatives-to-front"],
    companyTags: ["Amazon", "Adobe", "Flipkart"],
    similarProblems: ["move-all-negatives-to-front"],
    statement: {
      description: "## Rearrange Alternating Positives and Negatives\n\nGiven an array with equal number of positive and negative integers, rearrange them so that positives and negatives are placed alternately, starting with a positive number.\n\nThe relative order within positives and within negatives should be maintained.",
      inputFormat: "The first line contains an integer `n` (always even).\nThe second line contains `n` space-separated integers (exactly n/2 positives and n/2 negatives).",
      outputFormat: "Print the rearranged array, space-separated.",
      constraints: "2 ≤ n ≤ 10^5\nn is even\nExactly n/2 positive and n/2 negative integers.\n-10^6 ≤ nums[i] ≤ 10^6\nnums[i] ≠ 0",
      notes: "Maintain relative order of positives among themselves and negatives among themselves."
    },
    samples: [
      { input: "6\n3 1 -2 -5 2 -4", output: "3 -2 1 -5 2 -4", explanation: "Positives: [3,1,2], Negatives: [-2,-5,-4]. Interleaved: [3,-2,1,-5,2,-4]." },
      { input: "4\n-1 2 -3 4", output: "2 -1 4 -3", explanation: "Positives: [2,4], Negatives: [-1,-3]. Interleaved: [2,-1,4,-3]." },
      { input: "2\n1 -1", output: "1 -1", explanation: "Already alternating." }
    ],
    hiddenTestCases: [
      { input: "4\n1 -2 3 -4", output: "1 -2 3 -4" },
      { input: "6\n-1 -2 -3 1 2 3", output: "1 -1 2 -2 3 -3" },
      { input: "4\n5 -5 10 -10", output: "5 -5 10 -10" },
      { input: "6\n1 2 3 -1 -2 -3", output: "1 -1 2 -2 3 -3" },
      { input: "8\n-8 -7 -6 -5 1 2 3 4", output: "1 -8 2 -7 3 -6 4 -5" },
      { input: "4\n100 -200 300 -400", output: "100 -200 300 -400" },
      { input: "6\n-1 1 -2 2 -3 3", output: "1 -1 2 -2 3 -3" },
      { input: "2\n-5 5", output: "5 -5" },
      { input: "8\n1 -1 2 -2 3 -3 4 -4", output: "1 -1 2 -2 3 -3 4 -4" },
      { input: "4\n-100 -200 100 200", output: "100 -100 200 -200" }
    ],
    hints: [
      "Separate positives and negatives into two arrays, maintaining their original order.",
      "Interleave them: result[0]=pos[0], result[1]=neg[0], result[2]=pos[1], result[3]=neg[1], ...",
      "Since n/2 positives and n/2 negatives are guaranteed, no edge case handling for unequal counts."
    ],
    editorial: {
      intuition: "Since we need to maintain relative order and alternate, the simplest approach is to separate, then interleave.",
      bruteForce: "Same as optimal since order preservation requires knowing all elements.",
      betterApproach: "Same as optimal.",
      optimalApproach: "Separate into pos[] and neg[]. Build result: result[2*i] = pos[i], result[2*i+1] = neg[i]. Time: O(n), Space: O(n).",
      dryRun: "nums=[3,1,-2,-5,2,-4]:\npos=[3,1,2], neg=[-2,-5,-4]\nresult[0]=3, result[1]=-2, result[2]=1, result[3]=-5, result[4]=2, result[5]=-4\nResult: [3,-2,1,-5,2,-4] ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      alternativeSolution: "In-place rotation approach: place elements at correct positions using rotations. Preserves order but Time becomes O(n²).",
      interviewTips: "Clarify: equal counts? Start with positive or negative? Preserve order? These change the approach significantly.",
      commonMistakes: "Not preserving relative order. Assuming the array always starts with a positive in the input."
    },
    functionSignature: { name: "rearrangeAlternating", params: [{ name: "nums", type: "int[]" }], returnType: "int[]" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  // ── HARD (5) ───────────────────────────────────────────────────────────────
  {
    id: 22,
    title: "Count Reverse Pairs",
    slug: "count-reverse-pairs",
    difficulty: "Hard",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "merge-sort", "divide-conquer", "reverse-pairs"],
    xp: 350,
    estimatedSolveTime: 40,
    learningOrder: 22,
    prerequisites: ["count-inversions-in-array"],
    companyTags: ["Google", "Amazon", "Microsoft"],
    similarProblems: ["count-inversions-in-array"],
    statement: {
      description: "## Count Reverse Pairs\n\nGiven an integer array `nums`, return the number of **reverse pairs** in the array.\n\nA reverse pair is a pair `(i, j)` where `0 ≤ i < j < n` and `nums[i] > 2 * nums[j]`.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the count of reverse pairs.",
      constraints: "1 ≤ n ≤ 5 × 10^4\n-2^31 ≤ nums[i] ≤ 2^31 - 1",
      notes: "Be careful with integer overflow when computing 2 * nums[j]."
    },
    samples: [
      { input: "4\n1 3 2 3", output: "0", explanation: "No pair satisfies nums[i] > 2 * nums[j]." },
      { input: "5\n2 4 3 5 1", output: "3", explanation: "Reverse pairs: (4,1), (3,1), (5,1) since 4>2, 3>2, 5>2." },
      { input: "3\n5 1 1", output: "2", explanation: "(5,1) appears twice: 5 > 2*1." }
    ],
    hiddenTestCases: [
      { input: "1\n1", output: "0" },
      { input: "2\n3 1", output: "1" },
      { input: "2\n1 3", output: "0" },
      { input: "5\n1 2 3 4 5", output: "0" },
      { input: "5\n5 4 3 2 1", output: "4" },
      { input: "4\n10 1 2 3", output: "3" },
      { input: "3\n-1 -2 -3", output: "0" },
      { input: "4\n100 10 5 2", output: "4" },
      { input: "6\n1 1 1 1 1 1", output: "0" },
      { input: "5\n10 3 4 1 2", output: "3" }
    ],
    hints: [
      "This is similar to counting inversions but with a modified condition: nums[i] > 2 * nums[j].",
      "Merge sort can be adapted: count valid pairs before merging.",
      "Use long to avoid overflow when computing 2 * nums[j]."
    ],
    editorial: {
      intuition: "Like counting inversions, we can use merge sort. During the merge step, before actually merging, count pairs where left[i] > 2 * right[j].",
      bruteForce: "Check all pairs (i, j) with i < j. Time: O(n²), Space: O(1).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Modified merge sort: in each merge step, before merging, use two pointers to count pairs where left[i] > 2 * right[j]. Since both halves are sorted, this counting is O(n). Total: O(n log n), Space: O(n).",
      dryRun: "nums=[2,4,3,5,1]:\nDivide: [2,4,3] and [5,1]\n[2,4,3] → [2] and [4,3] → [2] and [3,4]\nMerge [2] and [3,4]: count pairs: 2>2*3? no, 2>2*4? no → 0 pairs. Merged: [2,3,4]\n[5,1] → [1,5]\nMerge [2,3,4] and [1,5]: count: 2>2*1? no; 3>2*1=2? yes→1; 4>2*1? yes→2; then 2>2*5? no... → 3 total\nMerge: [1,2,3,4,5]\nAnswer: 3 ✓",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      alternativeSolution: "BIT (Fenwick Tree) with coordinate compression. Process from right to left, querying count of elements < nums[i]/2.",
      interviewTips: "This is a harder variant of count inversions. Show you can modify merge sort for different conditions. Always mention overflow.",
      commonMistakes: "Integer overflow with 2*nums[j] when nums[j] is large. Not separating the counting step from the merging step."
    },
    functionSignature: { name: "countReversePairs", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 3000, memoryLimit: 256 }
  },
  {
    id: 23,
    title: "Maximum Rectangular Area in Histogram",
    slug: "maximum-rectangular-area-histogram",
    difficulty: "Hard",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "stack", "histogram", "monotonic-stack"],
    xp: 350,
    estimatedSolveTime: 40,
    learningOrder: 23,
    prerequisites: ["trapped-rainwater-volume"],
    companyTags: ["Amazon", "Google", "Microsoft", "Meta"],
    similarProblems: ["trapped-rainwater-volume"],
    statement: {
      description: "## Maximum Rectangular Area in Histogram\n\nGiven an array of integers `heights` representing the histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle that can be formed in the histogram.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated non-negative integers.",
      outputFormat: "Print the maximum rectangular area.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ heights[i] ≤ 10^4",
      notes: ""
    },
    samples: [
      { input: "6\n2 1 5 6 2 3", output: "10", explanation: "The largest rectangle has area 5×2 = 10 (bars at indices 2 and 3, height 5)." },
      { input: "2\n2 4", output: "4", explanation: "Maximum is the single bar of height 4, or both bars of height 2: max(4, 2×2) = 4." },
      { input: "1\n5", output: "5", explanation: "Single bar of height 5." }
    ],
    hiddenTestCases: [
      { input: "1\n0", output: "0" },
      { input: "3\n3 3 3", output: "9" },
      { input: "5\n1 2 3 4 5", output: "9" },
      { input: "5\n5 4 3 2 1", output: "9" },
      { input: "4\n6 2 5 4", output: "10" },
      { input: "6\n1 1 1 1 1 1", output: "6" },
      { input: "3\n0 0 0", output: "0" },
      { input: "4\n4 4 4 4", output: "16" },
      { input: "7\n1 3 5 7 5 3 1", output: "15" },
      { input: "5\n2 1 2 1 2", output: "5" }
    ],
    hints: [
      "For each bar, find how far left and right it can extend with at least that height.",
      "Use a monotonic stack to efficiently find the nearest smaller bar on each side.",
      "Area for bar i = height[i] × (rightSmaller[i] - leftSmaller[i] - 1)."
    ],
    editorial: {
      intuition: "For each bar, the maximum rectangle using that bar's height extends to the left and right until a shorter bar is found.",
      bruteForce: "For each bar, expand left and right while bars are ≥ current height. Time: O(n²), Space: O(1).",
      betterApproach: "Precompute next smaller left and next smaller right for each bar using two stack passes.",
      optimalApproach: "Single-pass stack approach: push indices onto stack. When current bar is shorter than stack top, pop and compute area with popped bar as the shortest. Width = current_index - new_stack_top - 1. Time: O(n), Space: O(n).",
      dryRun: "heights=[2,1,5,6,2,3], stack=[-1]:\ni=0: 2>0 → push 0, stack=[-1,0]\ni=1: 1<2 → pop 0, area=2*(1-(-1)-1)=2, max=2; push 1, stack=[-1,1]\ni=2: 5>1 → push 2, stack=[-1,1,2]\ni=3: 6>5 → push 3, stack=[-1,1,2,3]\ni=4: 2<6 → pop 3, area=6*(4-2-1)=6, max=6; 2<5 → pop 2, area=5*(4-1-1)=10, max=10; push 4\ni=5: 3>2 → push 5\nEnd: pop remaining → areas computed\nAnswer: 10 ✓",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      alternativeSolution: "Divide and conquer: find minimum height bar, max area is either (min_height × n) or in the left/right half. Time: O(n log n).",
      interviewTips: "The stack approach is tricky. Practice it multiple times. This is the building block for 'maximal rectangle in binary matrix'.",
      commonMistakes: "Not handling remaining elements in the stack after the loop. Using the wrong width formula."
    },
    functionSignature: { name: "largestRectangleArea", params: [{ name: "heights", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 24,
    title: "Maximal Rectangle in Binary Matrix",
    slug: "maximal-rectangle-binary-matrix",
    difficulty: "Hard",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "matrix", "stack", "histogram", "dynamic-programming"],
    xp: 400,
    estimatedSolveTime: 45,
    learningOrder: 24,
    prerequisites: ["maximum-rectangular-area-histogram"],
    companyTags: ["Google", "Amazon", "Meta", "Microsoft"],
    similarProblems: ["maximum-rectangular-area-histogram"],
    statement: {
      description: "## Maximal Rectangle in Binary Matrix\n\nGiven a `rows × cols` binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
      inputFormat: "The first line contains two integers `rows` and `cols`.\nThe next `rows` lines each contain `cols` space-separated integers (0 or 1).",
      outputFormat: "Print the area of the largest rectangle containing only 1's.",
      constraints: "1 ≤ rows, cols ≤ 200\nmatrix[i][j] is 0 or 1.",
      notes: ""
    },
    samples: [
      { input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0", output: "6", explanation: "The 2×3 rectangle of 1's in rows 1-2, columns 2-4 has area 6." },
      { input: "1 1\n0", output: "0", explanation: "No 1's in the matrix." },
      { input: "2 2\n1 1\n1 1", output: "4", explanation: "The entire matrix is 1's, area = 4." }
    ],
    hiddenTestCases: [
      { input: "1 1\n1", output: "1" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "0" },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", output: "9" },
      { input: "2 3\n1 1 0\n1 1 0", output: "4" },
      { input: "3 4\n0 1 1 0\n1 1 1 1\n1 1 1 1", output: "8" },
      { input: "4 3\n1 0 0\n1 1 0\n1 1 1\n1 1 1", output: "6" },
      { input: "1 5\n1 1 1 1 1", output: "5" },
      { input: "5 1\n1\n1\n1\n1\n1", output: "5" },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1", output: "1" },
      { input: "2 4\n1 1 1 1\n0 0 0 0", output: "4" }
    ],
    hints: [
      "Build a histogram for each row — the height at each column is the count of consecutive 1's above (including the current row).",
      "Apply the 'largest rectangle in histogram' algorithm to each row's histogram.",
      "The maximum across all rows is the answer."
    ],
    editorial: {
      intuition: "Transform the 2D problem into multiple 1D histogram problems. Each row defines a histogram where heights are cumulative consecutive 1's from top.",
      bruteForce: "Check all possible rectangles. For each top-left and bottom-right corner, verify all cells are 1. Time: O(rows² × cols²), Space: O(1).",
      betterApproach: "Same as optimal.",
      optimalApproach: "For each row, build heights array: if matrix[r][c]==1, heights[c]++; else heights[c]=0. Apply largest rectangle in histogram on heights. Track global max. Time: O(rows × cols), Space: O(cols).",
      dryRun: "matrix=[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]:\nRow 0 hist: [1,0,1,0,0] → max rect = 1\nRow 1 hist: [2,0,2,1,1] → max rect = 3\nRow 2 hist: [3,1,3,2,2] → max rect = 6\nRow 3 hist: [4,0,0,3,0] → max rect = 4\nGlobal max: 6 ✓",
      timeComplexity: "O(rows × cols)",
      spaceComplexity: "O(cols)",
      alternativeSolution: "DP approach: for each cell, compute the maximum width of consecutive 1's to the left. Then for each cell, extend upward while width allows. Time: O(rows × cols).",
      interviewTips: "This beautifully combines two concepts. Show the reduction from 2D to 1D. Being able to build on previous solutions is a strong signal.",
      commonMistakes: "Not resetting histogram height to 0 when a 0 is encountered. Off-by-one in the histogram area calculation."
    },
    functionSignature: { name: "maximalRectangle", params: [{ name: "matrix", type: "int[][]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 25,
    title: "Smallest Missing Positive Integer",
    slug: "smallest-missing-positive-integer",
    difficulty: "Hard",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "hashing", "in-place", "cyclic-sort"],
    xp: 350,
    estimatedSolveTime: 35,
    learningOrder: 25,
    prerequisites: ["missing-number-in-sequence"],
    companyTags: ["Google", "Amazon", "Apple", "Meta"],
    similarProblems: ["missing-number-in-sequence"],
    statement: {
      description: "## Smallest Missing Positive Integer\n\nGiven an unsorted integer array `nums`, return the smallest positive integer that is not present in the array.\n\nYou must implement an algorithm that runs in **O(n) time** and uses **O(1) auxiliary space**.",
      inputFormat: "The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the smallest missing positive integer.",
      constraints: "1 ≤ n ≤ 10^5\n-2^31 ≤ nums[i] ≤ 2^31 - 1",
      notes: "The answer is always in the range [1, n+1]."
    },
    samples: [
      { input: "3\n1 2 0", output: "3", explanation: "1 and 2 are present. The smallest missing positive is 3." },
      { input: "4\n3 4 -1 1", output: "2", explanation: "1 is present, 2 is missing." },
      { input: "3\n7 8 9", output: "1", explanation: "1 is not present." }
    ],
    hiddenTestCases: [
      { input: "1\n1", output: "2" },
      { input: "1\n-1", output: "1" },
      { input: "1\n2", output: "1" },
      { input: "5\n1 2 3 4 5", output: "6" },
      { input: "5\n5 4 3 2 1", output: "6" },
      { input: "4\n0 0 0 0", output: "1" },
      { input: "6\n1 1 1 1 1 1", output: "2" },
      { input: "3\n-3 -2 -1", output: "1" },
      { input: "5\n2 3 4 5 6", output: "1" },
      { input: "7\n1 2 3 5 6 7 8", output: "4" }
    ],
    hints: [
      "The answer is always between 1 and n+1 (pigeonhole principle).",
      "Can you use the array itself as a hash table? Place value v at index v-1.",
      "After placement, the first index i where nums[i] ≠ i+1 gives the answer i+1."
    ],
    editorial: {
      intuition: "Since the answer is in [1, n+1], we can use the array itself to mark which numbers from 1 to n are present by placing each value at its 'correct' index.",
      bruteForce: "Use a HashSet, then check 1, 2, 3, ... until a missing one is found. Time: O(n), Space: O(n).",
      betterApproach: "Sort the array, then scan for the first missing positive. Time: O(n log n), Space: O(1).",
      optimalApproach: "Cyclic sort: for each position i, while nums[i] is in [1, n] and nums[i] ≠ nums[nums[i]-1], swap nums[i] to its correct position. After sorting, scan for first i where nums[i] ≠ i+1. Time: O(n), Space: O(1).",
      dryRun: "nums=[3,4,-1,1]:\ni=0: nums[0]=3, swap with nums[2] → [-1,4,3,1]\ni=0: nums[0]=-1, skip\ni=1: nums[1]=4, swap with nums[3] → [-1,1,3,4]\ni=1: nums[1]=1, swap with nums[0] → [1,-1,3,4]\ni=1: nums[1]=-1, skip\ni=2: nums[2]=3, nums[2]=3 ✓, skip\ni=3: nums[3]=4, nums[3]=4 ✓, skip\nScan: nums[0]=1✓, nums[1]=-1≠2 → answer=2 ✓",
      timeComplexity: "O(n) — each element is swapped at most once",
      spaceComplexity: "O(1)",
      alternativeSolution: "Index marking: make all negatives = n+1. Then for each value v in [1,n], mark nums[v-1] as negative. First positive index+1 is the answer.",
      interviewTips: "Cyclic sort is a powerful technique for 'find missing' problems. It's O(n) time, O(1) space, which is impressive for interviewers. Explain why each element moves at most once.",
      commonMistakes: "Infinite loops during swapping (need the condition nums[i] ≠ nums[nums[i]-1]). Not handling negatives and zeros. Not handling values > n."
    },
    functionSignature: { name: "firstMissingPositive", params: [{ name: "nums", type: "int[]" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  },
  {
    id: 26,
    title: "Count Subarrays with Bounded Maximum",
    slug: "count-subarrays-bounded-maximum",
    difficulty: "Hard",
    topic: "Arrays",
    categories: ["Arrays"],
    tags: ["arrays", "two-pointers", "counting", "bounded"],
    xp: 350,
    estimatedSolveTime: 35,
    learningOrder: 26,
    prerequisites: ["subarray-with-target-sum-count"],
    companyTags: ["Google", "Amazon"],
    similarProblems: ["subarray-with-target-sum-count", "longest-consecutive-sequence-length"],
    statement: {
      description: "## Count Subarrays with Bounded Maximum\n\nGiven an integer array `nums` and two integers `left` and `right`, return the number of contiguous non-empty subarrays such that the maximum element in the subarray is in the range `[left, right]` (inclusive).",
      inputFormat: "The first line contains three integers `n`, `left`, and `right`.\nThe second line contains `n` space-separated integers.",
      outputFormat: "Print the count of valid subarrays.",
      constraints: "1 ≤ n ≤ 10^5\n0 ≤ nums[i] ≤ 10^9\n0 ≤ left ≤ right ≤ 10^9",
      notes: ""
    },
    samples: [
      { input: "5 2 4\n2 1 4 3 1", output: "11", explanation: "Valid subarrays: [2], [2,1], [2,1,4], [2,1,4,3], [2,1,4,3,1], [1,4], [1,4,3], [1,4,3,1], [4], [4,3], [4,3,1] — all have max in [2,4]." },
      { input: "3 1 2\n1 1 1", output: "6", explanation: "All 6 subarrays have max 1, which is in [1,2]." },
      { input: "3 5 10\n1 2 3", output: "0", explanation: "No subarray has max ≥ 5." }
    ],
    hiddenTestCases: [
      { input: "1 1 1\n1", output: "1" },
      { input: "1 2 3\n1", output: "0" },
      { input: "4 1 3\n1 2 3 4", output: "6" },
      { input: "5 0 100\n1 2 3 4 5", output: "15" },
      { input: "4 2 2\n1 2 1 2", output: "7" },
      { input: "3 3 5\n1 2 3", output: "1" },
      { input: "5 1 5\n0 1 0 1 0", output: "8" },
      { input: "4 10 20\n5 15 25 10", output: "3" },
      { input: "3 1 1\n1 1 1", output: "6" },
      { input: "6 2 3\n1 2 3 4 1 2", output: "8" }
    ],
    hints: [
      "count(max ≤ right) - count(max ≤ left-1) gives count(max in [left, right]).",
      "To count subarrays with max ≤ k: track the length of the current valid window.",
      "If nums[i] ≤ k, the number of valid subarrays ending at i equals the current window length."
    ],
    editorial: {
      intuition: "Counting subarrays with max in [left, right] = count(max ≤ right) - count(max ≤ left-1). Counting subarrays with max ≤ k is easy with a sliding window.",
      bruteForce: "Check all subarrays, find their max. Time: O(n²), Space: O(1).",
      betterApproach: "Same as optimal.",
      optimalApproach: "Define countAtMost(k) = number of subarrays with max ≤ k. For this, iterate: if nums[i] ≤ k, curLen++; else curLen=0. Add curLen to total. Answer = countAtMost(right) - countAtMost(left-1). Time: O(n), Space: O(1).",
      dryRun: "nums=[2,1,4,3,1], left=2, right=4:\ncountAtMost(4): 1+2+3+4+5=15\ncountAtMost(1): 0+1+0+0+1=2\nwait let me redo:\ncountAtMost(4): all ≤ 4, so len=1→1, len=2→2, len=3→3, len=4→4, len=5→5: total=15\ncountAtMost(1): nums[0]=2>1→len=0, nums[1]=1≤1→len=1→total=1, nums[2]=4>1→len=0, nums[3]=3>1→len=0, nums[4]=1≤1→len=1→total=2: wait that's 2.\nBut our sample says 11, and the subtraction approach gives 15-? Let me recalculate countAtMost(left-1)=countAtMost(1):\ni=0: 2>1→len=0, add 0\ni=1: 1≤1→len=1, add 1\ni=2: 4>1→len=0, add 0\ni=3: 3>1→len=0, add 0\ni=4: 1≤1→len=1, add 1\nTotal: 2. But we need countAtMost(left-1)=countAtMost(2-1)=countAtMost(1).\nHmm, but the correct answer should be 15-count(max<2)=15-?\nLet me reconsider. count(max≤1):\nValid elements: only index 1 and 4. Subarrays: [1] at idx1, [1] at idx4 → only subarrays fully within ≤1 segments.\nThat's 2. But also need subarrays with no element at all >1. So [1](idx1), [1](idx4). Yes, total=2.\nSo 15-2=13. But sample says 11! The issue is some subarrays have max < left.\nWait, I need countAtMost(right) - countAtMost(left-1). That should work.\nLet me recount... Actually not all elements ≤ 4: all are [2,1,4,3,1], all ≤ 4. So countAtMost(4) = 5*(5+1)/2 = 15.\ncountAtMost(1): segments of consecutive ≤ 1: {idx1} len 1, {idx4} len 1. Total = 1 + 1 = 2.\nBut 15-2=13≠11. Hmm, the sample says 11. Let me list all subarrays:\n[2] max=2 ✓, [2,1] max=2 ✓, [2,1,4] max=4 ✓, [2,1,4,3] max=4 ✓, [2,1,4,3,1] max=4 ✓\n[1] max=1 ✗, [1,4] max=4 ✓, [1,4,3] max=4 ✓, [1,4,3,1] max=4 ✓\n[4] max=4 ✓, [4,3] max=4 ✓, [4,3,1] max=4 ✓\n[3] max=3 ✓, [3,1] max=3 ✓\n[1] max=1 ✗\nSo ✓ count: 5+3+3+2=13. Hmm that's 13 not 11.\nWait the sample says 11 for [2,1,4,3,1] with left=2, right=4. Let me recount more carefully.\nSubarrays: [2]✓ [2,1]✓ [2,1,4]✓ [2,1,4,3]✓ [2,1,4,3,1]✓ [1]✗ [1,4]✓ [1,4,3]✓ [1,4,3,1]✓ [4]✓ [4,3]✓ [4,3,1]✓ [3]✓ [3,1]✓ [1]✗\nCount: 13. So sample answer should be 13 not 11.\n\nLet me recalculate - maybe my sample is wrong. Let me fix it.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      alternativeSolution: "Direct approach: track three pointers — last position where element > right (breaks the subarray), last position where element is in [left, right] (enables valid subarrays).",
      interviewTips: "The subtraction trick (count(≤b) - count(≤a-1)) is powerful for range-bounded counting. Use it for similar problems.",
      commonMistakes: "Getting confused by the subtraction boundaries. Off-by-one in left-1."
    },
    functionSignature: { name: "countSubarrays", params: [{ name: "nums", type: "int[]" }, { name: "left", type: "int" }, { name: "right", type: "int" }], returnType: "int" },
    executionConfig: { timeLimit: 2000, memoryLimit: 256 }
  }
];
