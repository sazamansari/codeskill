export const BADGES = [
  { id: "first_solve", icon: "🎯", name: "First Solve", desc: "Solve your first problem" },
  { id: "five_solved", icon: "🔥", name: "On Fire", desc: "Solve 5 problems" },
  { id: "ten_solved", icon: "⭐", name: "Rising Star", desc: "Solve 10 problems" },
  { id: "twentyfive_solved", icon: "💎", name: "Diamond Coder", desc: "Solve 25 problems" },
  { id: "fifty_solved", icon: "🏆", name: "Half Century", desc: "Solve 50 problems" },
  { id: "century", icon: "💯", name: "Centurion", desc: "Solve 100 problems" },
  { id: "hard_first", icon: "🏔️", name: "Summit", desc: "Solve a Hard problem" },
  { id: "hard_master", icon: "🔱", name: "Hard Master", desc: "Solve 10 Hard problems" },
  { id: "streak_3", icon: "📅", name: "Consistent", desc: "3-day coding streak" },
  { id: "streak_7", icon: "🔗", name: "Unstoppable", desc: "7-day coding streak" },
  { id: "streak_30", icon: "⚡", name: "Legendary", desc: "30-day coding streak" },
  { id: "polyglot", icon: "🌈", name: "Polyglot", desc: "10+ solved in DSA, SQL, and JS each" },
  { id: "xp_500", icon: "📈", name: "XP Hunter", desc: "Earn 500 XP" },
  { id: "xp_1000", icon: "🚀", name: "XP Master", desc: "Earn 1000 XP" },
];

export const TEMPLATES = [
  { name: "BFS (Graph/Tree)", icon: "🌊", code: `from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited` },
  { name: "DFS (Recursive)", icon: "🔍", code: `def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited` },
  { name: "Binary Search", icon: "🎯", code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1` },
  { name: "Sliding Window", icon: "🪟", code: `def sliding_window(arr, k):\n    window_sum = sum(arr[:k])\n    max_sum = window_sum\n    for i in range(k, len(arr)):\n        window_sum += arr[i] - arr[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum` },
  { name: "Two Pointers", icon: "👆", code: `def two_pointers(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n    return []` },
  { name: "DP (1D)", icon: "📊", code: `def dp_1d(n):\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    for i in range(1, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]` },
  { name: "Backtracking", icon: "↩️", code: `def backtrack(candidates, target, path, result, start):\n    if target == 0:\n        result.append(path[:])\n        return\n    for i in range(start, len(candidates)):\n        if candidates[i] > target: break\n        path.append(candidates[i])\n        backtrack(candidates, target - candidates[i], path, result, i)\n        path.pop()` },
  { name: "Union Find", icon: "🔗", code: `class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py: return False\n        if self.rank[px] < self.rank[py]: px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]: self.rank[px] += 1\n        return True` },
  { name: "Trie", icon: "🌳", code: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self): self.root = TrieNode()\n    def insert(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children: node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n    def search(self, word):\n        node = self.root\n        for c in word:\n            if c not in node.children: return False\n            node = node.children[c]\n        return node.is_end` },
  { name: "Merge Sort", icon: "🔀", code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: result.append(left[i]); i += 1\n        else: result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]` },
];

export const COMPANY_TAGS = {
  1:["Google","Amazon","Microsoft","Meta","Apple"],2:["Amazon","Microsoft","Goldman Sachs"],3:["Amazon","Adobe","Apple"],
  4:["Amazon","Microsoft","Apple","LinkedIn"],5:["Amazon","Meta","Microsoft","Apple"],6:["Amazon","Meta","Microsoft"],
  7:["Amazon","Goldman Sachs","Microsoft"],8:["Google","Meta","Microsoft"],9:["Microsoft","Amazon","Adobe"],
  10:["Google","Amazon","Microsoft"],11:["Amazon","Google","Microsoft","Goldman Sachs"],12:["Amazon","Microsoft"],
  13:["Amazon","Microsoft","Apple"],14:["Meta","Amazon","Apple"],15:["Amazon","Google","Microsoft"],
  16:["Meta","Amazon","Microsoft"],17:["Amazon","Meta","Google"],18:["Amazon","Google","Microsoft","Adobe"],
  19:["Amazon","Microsoft","Uber"],20:["Amazon","Google","Meta"],21:["Google","Amazon","Apple"],
  29:["Amazon","Microsoft","Apple","Google"],30:["Amazon","Microsoft","Goldman Sachs"],
  38:["Amazon","Google","Microsoft","Uber"],46:["Amazon","Google","Microsoft"],
  58:["Amazon","Google","Microsoft","Meta"],68:["Amazon","Google","Microsoft","Apple"],
  70:["Amazon","Google","Microsoft","Apple"],84:["Amazon","Google","Meta","Microsoft"],
  86:["Amazon","Google","Microsoft","Goldman Sachs"],89:["Amazon","Meta","Google","Microsoft"],
  90:["Amazon","Google","Microsoft","Uber"],94:["Amazon","Google","Microsoft"],
  96:["Amazon","Google","Microsoft","Meta"],99:["Amazon","Google","Microsoft"],
};

export const COMPANY_COLORS = {
  Google: "#4285F4", Amazon: "#FF9900", Microsoft: "#00A4EF", Meta: "#0668E1",
  Apple: "#555", Bloomberg: "#1E1E1E", Adobe: "#FF0000", "Goldman Sachs": "#7399C6",
  LinkedIn: "#0A66C2", Uber: "#000", Samsung: "#1428A0",
};
