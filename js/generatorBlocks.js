var loopCounter = 0; // Variable global para llevar la cuenta de los bucles

javascript.javascriptGenerator.forBlock['repeat'] = function (block, generator) {
  var number_repeat = block.getFieldValue('REPEAT');
  var loopVar = 'count' + loopCounter++; // Genera un nombre de variable único
  var statements_repeat = generator.statementToCode(block, 'REPEAT');
  var code = 'for (var ' + loopVar + ' = 0; ' + loopVar + ' < ' + number_repeat + '; ' + loopVar + '++) {\n' +
    statements_repeat +
    '}\n';
  return code;
};


javascript.javascriptGenerator.forBlock['fd'] = function (block, generator) {
  var number_fd = block.getFieldValue('FD');
  var code = 'moveForward(' + number_fd + ');\n';
  return code;
};

javascript.javascriptGenerator.forBlock['bk'] = function (block, generator) {
  var number_bk = block.getFieldValue('BK');
  var code = 'moveBackwards(' + number_bk + ');\n';
  return code;
};

javascript.javascriptGenerator.forBlock['rt'] = function (block, generator) {
  var number_rt = block.getFieldValue('RT');
  var code = 'turnRight(' + number_rt + ');\n';
  return code;
};

javascript.javascriptGenerator.forBlock['lt'] = function (block, generator) {
  var number_lt = block.getFieldValue('LT');
  var code = 'turnLeft(' + number_lt + ');\n';
  return code;
};



javascript.javascriptGenerator.forBlock['color'] = function (block, generator) {
  var color = block.getFieldValue('COLOR');
  var code = 'changeColor("' + color + '");\n';
  return code;
};
