/**
 * Language Template Engine for CodeSkill
 * Generates starter code and reference solutions for 15 programming languages
 * from a compact function signature definition.
 *
 * Supported Languages: C, C++, Java, Python, JavaScript, TypeScript, Go, Rust,
 *                      Kotlin, Swift, C#, PHP, Ruby, Scala, Dart
 */

// ── Type Mappings ──────────────────────────────────────────────────────────────

const TYPE_MAP = {
  c:          { int: 'int', 'int[]': 'int*', 'int[][]': 'int**', long: 'long long', 'long[]': 'long long*', string: 'char*', 'string[]': 'char**', bool: 'int', float: 'double', double: 'double', void: 'void', 'bool[]': 'int*', 'char': 'char', 'char[]': 'char*' },
  cpp:        { int: 'int', 'int[]': 'vector<int>', 'int[][]': 'vector<vector<int>>', long: 'long long', 'long[]': 'vector<long long>', string: 'string', 'string[]': 'vector<string>', bool: 'bool', float: 'double', double: 'double', void: 'void', 'bool[]': 'vector<bool>', 'char': 'char', 'char[]': 'vector<char>' },
  java:       { int: 'int', 'int[]': 'int[]', 'int[][]': 'int[][]', long: 'long', 'long[]': 'long[]', string: 'String', 'string[]': 'String[]', bool: 'boolean', float: 'double', double: 'double', void: 'void', 'bool[]': 'boolean[]', 'char': 'char', 'char[]': 'char[]' },
  python:     { int: 'int', 'int[]': 'List[int]', 'int[][]': 'List[List[int]]', long: 'int', 'long[]': 'List[int]', string: 'str', 'string[]': 'List[str]', bool: 'bool', float: 'float', double: 'float', void: 'None', 'bool[]': 'List[bool]', 'char': 'str', 'char[]': 'List[str]' },
  javascript: { int: 'number', 'int[]': 'number[]', 'int[][]': 'number[][]', long: 'number', 'long[]': 'number[]', string: 'string', 'string[]': 'string[]', bool: 'boolean', float: 'number', double: 'number', void: 'void', 'bool[]': 'boolean[]', 'char': 'string', 'char[]': 'string[]' },
  typescript: { int: 'number', 'int[]': 'number[]', 'int[][]': 'number[][]', long: 'number', 'long[]': 'number[]', string: 'string', 'string[]': 'string[]', bool: 'boolean', float: 'number', double: 'number', void: 'void', 'bool[]': 'boolean[]', 'char': 'string', 'char[]': 'string[]' },
  go:         { int: 'int', 'int[]': '[]int', 'int[][]': '[][]int', long: 'int64', 'long[]': '[]int64', string: 'string', 'string[]': '[]string', bool: 'bool', float: 'float64', double: 'float64', void: '', 'bool[]': '[]bool', 'char': 'byte', 'char[]': '[]byte' },
  rust:       { int: 'i32', 'int[]': 'Vec<i32>', 'int[][]': 'Vec<Vec<i32>>', long: 'i64', 'long[]': 'Vec<i64>', string: 'String', 'string[]': 'Vec<String>', bool: 'bool', float: 'f64', double: 'f64', void: '()', 'bool[]': 'Vec<bool>', 'char': 'char', 'char[]': 'Vec<char>' },
  kotlin:     { int: 'Int', 'int[]': 'IntArray', 'int[][]': 'Array<IntArray>', long: 'Long', 'long[]': 'LongArray', string: 'String', 'string[]': 'Array<String>', bool: 'Boolean', float: 'Double', double: 'Double', void: 'Unit', 'bool[]': 'BooleanArray', 'char': 'Char', 'char[]': 'CharArray' },
  swift:      { int: 'Int', 'int[]': '[Int]', 'int[][]': '[[Int]]', long: 'Int', 'long[]': '[Int]', string: 'String', 'string[]': '[String]', bool: 'Bool', float: 'Double', double: 'Double', void: 'Void', 'bool[]': '[Bool]', 'char': 'Character', 'char[]': '[Character]' },
  csharp:     { int: 'int', 'int[]': 'int[]', 'int[][]': 'int[][]', long: 'long', 'long[]': 'long[]', string: 'string', 'string[]': 'string[]', bool: 'bool', float: 'double', double: 'double', void: 'void', 'bool[]': 'bool[]', 'char': 'char', 'char[]': 'char[]' },
  php:        { int: 'int', 'int[]': 'array', 'int[][]': 'array', long: 'int', 'long[]': 'array', string: 'string', 'string[]': 'array', bool: 'bool', float: 'float', double: 'float', void: 'void', 'bool[]': 'array', 'char': 'string', 'char[]': 'array' },
  ruby:       { int: 'Integer', 'int[]': 'Array', 'int[][]': 'Array', long: 'Integer', 'long[]': 'Array', string: 'String', 'string[]': 'Array', bool: 'Boolean', float: 'Float', double: 'Float', void: 'nil', 'bool[]': 'Array', 'char': 'String', 'char[]': 'Array' },
  scala:      { int: 'Int', 'int[]': 'Array[Int]', 'int[][]': 'Array[Array[Int]]', long: 'Long', 'long[]': 'Array[Long]', string: 'String', 'string[]': 'Array[String]', bool: 'Boolean', float: 'Double', double: 'Double', void: 'Unit', 'bool[]': 'Array[Boolean]', 'char': 'Char', 'char[]': 'Array[Char]' },
  dart:       { int: 'int', 'int[]': 'List<int>', 'int[][]': 'List<List<int>>', long: 'int', 'long[]': 'List<int>', string: 'String', 'string[]': 'List<String>', bool: 'bool', float: 'double', double: 'double', void: 'void', 'bool[]': 'List<bool>', 'char': 'String', 'char[]': 'List<String>' },
};

const DEFAULT_RETURN_VALUES = {
  c:          { int: '0', 'int[]': 'NULL', 'int[][]': 'NULL', long: '0', 'long[]': 'NULL', string: '""', 'string[]': 'NULL', bool: '0', float: '0.0', double: '0.0', void: '', 'bool[]': 'NULL' },
  cpp:        { int: '0', 'int[]': '{}', 'int[][]': '{}', long: '0', 'long[]': '{}', string: '""', 'string[]': '{}', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': '{}' },
  java:       { int: '0', 'int[]': 'new int[]{}', 'int[][]': 'new int[][]{}', long: '0L', 'long[]': 'new long[]{}', string: '""', 'string[]': 'new String[]{}', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': 'new boolean[]{}' },
  python:     { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'False', float: '0.0', double: '0.0', void: 'None', 'bool[]': '[]' },
  javascript: { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: 'undefined', 'bool[]': '[]' },
  typescript: { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: 'undefined', 'bool[]': '[]' },
  go:         { int: '0', 'int[]': '[]int{}', 'int[][]': '[][]int{}', long: '0', 'long[]': '[]int64{}', string: '""', 'string[]': '[]string{}', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': '[]bool{}' },
  rust:       { int: '0', 'int[]': 'vec![]', 'int[][]': 'vec![]', long: '0', 'long[]': 'vec![]', string: 'String::new()', 'string[]': 'vec![]', bool: 'false', float: '0.0', double: '0.0', void: '()', 'bool[]': 'vec![]' },
  kotlin:     { int: '0', 'int[]': 'intArrayOf()', 'int[][]': 'arrayOf()', long: '0L', 'long[]': 'longArrayOf()', string: '""', 'string[]': 'arrayOf()', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': 'booleanArrayOf()' },
  swift:      { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: '()', 'bool[]': '[]' },
  csharp:     { int: '0', 'int[]': 'new int[]{}', 'int[][]': 'new int[][]{}', long: '0L', 'long[]': 'new long[]{}', string: '""', 'string[]': 'new string[]{}', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': 'new bool[]{}' },
  php:        { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: 'null', 'bool[]': '[]' },
  ruby:       { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: 'nil', 'bool[]': '[]' },
  scala:      { int: '0', 'int[]': 'Array[Int]()', 'int[][]': 'Array[Array[Int]]()', long: '0L', 'long[]': 'Array[Long]()', string: '""', 'string[]': 'Array[String]()', bool: 'false', float: '0.0', double: '0.0', void: '()', 'bool[]': 'Array[Boolean]()' },
  dart:       { int: '0', 'int[]': '[]', 'int[][]': '[]', long: '0', 'long[]': '[]', string: '""', 'string[]': '[]', bool: 'false', float: '0.0', double: '0.0', void: '', 'bool[]': '[]' },
};

// ── Helper: Convert camelCase to snake_case ────────────────────────────────────
function toSnakeCase(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

// ── Helper: Convert camelCase to PascalCase ────────────────────────────────────
function toPascalCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ── Helper: Get mapped type ────────────────────────────────────────────────────
function getType(lang, abstractType) {
  return (TYPE_MAP[lang] && TYPE_MAP[lang][abstractType]) || abstractType;
}

function getDefault(lang, abstractType) {
  return (DEFAULT_RETURN_VALUES[lang] && DEFAULT_RETURN_VALUES[lang][abstractType]) || '0';
}

// ── Language-Specific Generators ───────────────────────────────────────────────

const generators = {

  // ── C ──
  c: (sig) => {
    const retType = getType('c', sig.returnType);
    const params = sig.params.map(p => `${getType('c', p.type)} ${p.name}${p.type.endsWith('[]') && !p.type.endsWith('[][]') ? ', int ' + p.name + '_size' : ''}`).join(', ');
    const starter = `${retType} ${sig.name}(${params}) {\n    // Write your solution here\n    return ${getDefault('c', sig.returnType)};\n}`;
    return starter;
  },

  // ── C++ ──
  cpp: (sig) => {
    const retType = getType('cpp', sig.returnType);
    const params = sig.params.map(p => `${getType('cpp', p.type)} ${p.name}`).join(', ');
    const retDefault = getDefault('cpp', sig.returnType);
    const starter = `class Solution {\npublic:\n    ${retType} ${sig.name}(${params}) {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n    }\n};`;
    return starter;
  },

  // ── Java ──
  java: (sig) => {
    const retType = getType('java', sig.returnType);
    const params = sig.params.map(p => `${getType('java', p.type)} ${p.name}`).join(', ');
    const retDefault = getDefault('java', sig.returnType);
    const starter = `class Solution {\n    public ${retType} ${sig.name}(${params}) {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n    }\n}`;
    return starter;
  },

  // ── Python ──
  python: (sig) => {
    const snakeName = toSnakeCase(sig.name);
    const params = sig.params.map(p => `${p.name}: ${getType('python', p.type)}`).join(', ');
    const retType = getType('python', sig.returnType);
    const retDefault = getDefault('python', sig.returnType);
    const starter = `class Solution:\n    def ${snakeName}(self, ${params}) -> ${retType}:\n        # Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault}` : 'pass'}`;
    return starter;
  },

  // ── JavaScript ──
  javascript: (sig) => {
    const jsdocParams = sig.params.map(p => ` * @param {${getType('javascript', p.type)}} ${p.name}`).join('\n');
    const jsdocReturn = sig.returnType !== 'void' ? ` * @return {${getType('javascript', sig.returnType)}}` : '';
    const params = sig.params.map(p => p.name).join(', ');
    const retDefault = getDefault('javascript', sig.returnType);
    const starter = `/**\n${jsdocParams}\n${jsdocReturn}\n */\nfunction ${sig.name}(${params}) {\n    // Write your solution here\n    ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n}`;
    return starter;
  },

  // ── TypeScript ──
  typescript: (sig) => {
    const params = sig.params.map(p => `${p.name}: ${getType('typescript', p.type)}`).join(', ');
    const retType = getType('typescript', sig.returnType);
    const retDefault = getDefault('typescript', sig.returnType);
    const starter = `function ${sig.name}(${params}): ${retType} {\n    // Write your solution here\n    ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n}`;
    return starter;
  },

  // ── Go ──
  go: (sig) => {
    const pascalName = toPascalCase(sig.name);
    const params = sig.params.map(p => `${p.name} ${getType('go', p.type)}`).join(', ');
    const retType = getType('go', sig.returnType);
    const retDefault = getDefault('go', sig.returnType);
    const retSig = retType ? ` ${retType}` : '';
    const starter = `func ${pascalName}(${params})${retSig} {\n    // Write your solution here\n    ${sig.returnType !== 'void' ? `return ${retDefault}` : ''}\n}`;
    return starter;
  },

  // ── Rust ──
  rust: (sig) => {
    const snakeName = toSnakeCase(sig.name);
    const params = sig.params.map(p => `${p.name}: ${getType('rust', p.type)}`).join(', ');
    const retType = getType('rust', sig.returnType);
    const retDefault = getDefault('rust', sig.returnType);
    const retSig = sig.returnType !== 'void' ? ` -> ${retType}` : '';
    const starter = `impl Solution {\n    pub fn ${snakeName}(${params})${retSig} {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? retDefault : ''}\n    }\n}`;
    return starter;
  },

  // ── Kotlin ──
  kotlin: (sig) => {
    const params = sig.params.map(p => `${p.name}: ${getType('kotlin', p.type)}`).join(', ');
    const retType = getType('kotlin', sig.returnType);
    const retDefault = getDefault('kotlin', sig.returnType);
    const retSig = sig.returnType !== 'void' ? `: ${retType}` : '';
    const starter = `class Solution {\n    fun ${sig.name}(${params})${retSig} {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault}` : ''}\n    }\n}`;
    return starter;
  },

  // ── Swift ──
  swift: (sig) => {
    const params = sig.params.map(p => `_ ${p.name}: ${getType('swift', p.type)}`).join(', ');
    const retType = getType('swift', sig.returnType);
    const retDefault = getDefault('swift', sig.returnType);
    const retSig = sig.returnType !== 'void' ? ` -> ${retType}` : '';
    const starter = `class Solution {\n    func ${sig.name}(${params})${retSig} {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault}` : ''}\n    }\n}`;
    return starter;
  },

  // ── C# ──
  csharp: (sig) => {
    const pascalName = toPascalCase(sig.name);
    const retType = getType('csharp', sig.returnType);
    const params = sig.params.map(p => `${getType('csharp', p.type)} ${p.name}`).join(', ');
    const retDefault = getDefault('csharp', sig.returnType);
    const starter = `public class Solution {\n    public ${retType} ${pascalName}(${params}) {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n    }\n}`;
    return starter;
  },

  // ── PHP ──
  php: (sig) => {
    const params = sig.params.map(p => `$${p.name}`).join(', ');
    const retDefault = getDefault('php', sig.returnType);
    const starter = `class Solution {\n    /**\n${sig.params.map(p => `     * @param ${getType('php', p.type)} $${p.name}`).join('\n')}\n     * @return ${getType('php', sig.returnType)}\n     */\n    function ${sig.name}(${params}) {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n    }\n}`;
    return starter;
  },

  // ── Ruby ──
  ruby: (sig) => {
    const snakeName = toSnakeCase(sig.name);
    const params = sig.params.map(p => p.name).join(', ');
    const retDefault = getDefault('ruby', sig.returnType);
    const starter = `# @param {${sig.params.map(p => `${getType('ruby', p.type)} ${p.name}`).join(', ')}}\n# @return {${getType('ruby', sig.returnType)}}\ndef ${snakeName}(${params})\n    # Write your solution here\n    ${sig.returnType !== 'void' ? retDefault : 'nil'}\nend`;
    return starter;
  },

  // ── Scala ──
  scala: (sig) => {
    const params = sig.params.map(p => `${p.name}: ${getType('scala', p.type)}`).join(', ');
    const retType = getType('scala', sig.returnType);
    const retDefault = getDefault('scala', sig.returnType);
    const starter = `object Solution {\n    def ${sig.name}(${params}): ${retType} = {\n        // Write your solution here\n        ${retDefault}\n    }\n}`;
    return starter;
  },

  // ── Dart ──
  dart: (sig) => {
    const retType = getType('dart', sig.returnType);
    const params = sig.params.map(p => `${getType('dart', p.type)} ${p.name}`).join(', ');
    const retDefault = getDefault('dart', sig.returnType);
    const starter = `class Solution {\n    ${retType} ${sig.name}(${params}) {\n        // Write your solution here\n        ${sig.returnType !== 'void' ? `return ${retDefault};` : ''}\n    }\n}`;
    return starter;
  },
};

// ── Main API ───────────────────────────────────────────────────────────────────

const ALL_LANG_IDS = Object.keys(generators);

/**
 * Generate starter code for all languages given a function signature.
 * @param {Object} sig - { name: string, params: [{name, type}], returnType: string }
 * @returns {Object} Map of languageId -> starter code string
 */
function generateStarterCode(sig) {
  const result = {};
  for (const lang of ALL_LANG_IDS) {
    try {
      result[lang] = generators[lang](sig);
    } catch (e) {
      result[lang] = `// Error generating ${lang} starter code: ${e.message}`;
    }
  }
  return result;
}

/**
 * Generate reference solutions for all languages from provided solution map.
 * Falls back to starter code with TODO comment if no solution provided.
 * @param {Object} sig - function signature
 * @param {Object} solutions - Map of languageId -> solution code (can be partial)
 * @returns {Object} Map of languageId -> solution code string
 */
function generateReferenceSolutions(sig, solutions = {}) {
  const result = {};
  for (const lang of ALL_LANG_IDS) {
    if (solutions[lang]) {
      result[lang] = solutions[lang];
    } else if (solutions.javascript && lang !== 'javascript') {
      // Provide the JS solution as a reference comment for other languages
      result[lang] = generators[lang](sig).replace(
        '// Write your solution here',
        '// TODO: Port the reference solution from JavaScript\n        // Write your solution here'
      );
    } else {
      result[lang] = generators[lang](sig);
    }
  }
  return result;
}

/**
 * Get the list of all supported language IDs
 */
function getSupportedLanguages() {
  return [...ALL_LANG_IDS];
}

module.exports = {
  generateStarterCode,
  generateReferenceSolutions,
  getSupportedLanguages,
  TYPE_MAP,
  ALL_LANG_IDS,
  toSnakeCase,
  toPascalCase,
};
