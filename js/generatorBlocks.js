var loopCounter = 0;

javascript.javascriptGenerator.forBlock['repeat'] = function (block, generator) {
  var number_repeat = block.getFieldValue('REPEAT');
  var loopVar = 'count' + loopCounter++;
  var statements_repeat = generator.statementToCode(block, 'REPEAT');
  var code = 'for (var ' + loopVar + ' = 0; ' + loopVar + ' < ' + number_repeat + '; ' + loopVar + '++) {\n' +
    statements_repeat +
    'await delay();}\n';
  return code;
};


javascript.javascriptGenerator.forBlock['fd'] = function (block, generator) {
  var number_fd = block.getFieldValue('FD');
  var code = 'moveForward(' + number_fd + ');\nawait delay();';
  return code;
};

javascript.javascriptGenerator.forBlock['bk'] = function (block, generator) {
  var number_bk = block.getFieldValue('BK');
  var code = 'moveBackwards(' + number_bk + ');\nawait delay();';
  return code;
};

javascript.javascriptGenerator.forBlock['rt'] = function (block, generator) {
  var number_rt = block.getFieldValue('RT');
  var code = 'turnRight(' + number_rt + ');\nawait delay();';
  return code;
};

javascript.javascriptGenerator.forBlock['lt'] = function (block, generator) {
  var number_lt = block.getFieldValue('LT');
  var code = 'turnLeft(' + number_lt + ');\nawait delay();';
  return code;
};



javascript.javascriptGenerator.forBlock['color'] = function (block, generator) {
  var color = parseInt(block.getFieldValue('COLOR'));
  var code = 'changeColor("' + color + '");\n';
  return code;
};


javascript.javascriptGenerator.forBlock['pu'] = function (block, generator) {
  var code = 'tooglePen(false);\n';
  return code;
};
javascript.javascriptGenerator.forBlock['pd'] = function (block, generator) {
  var code = 'tooglePen(true);\n';
  return code;
};
javascript.javascriptGenerator.forBlock['setpensize'] = function (block, generator) {
  var size = parseInt(block.getFieldValue('SETPENSIZE'));
  var code = 'changePenSize("' + size + '");\n';
  return code;
};

Blockly.JavaScript['start'] = function (block) {
  // Aquí puedes definir qué JavaScript se genera para el bloque "start".
  // Por ejemplo, podrías querer que simplemente actúe como un punto de inicio sin generar código específico:
  return ''; // No genera ningún código JavaScript.
};