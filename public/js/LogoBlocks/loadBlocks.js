var toolbox = document.getElementById("toolbox");

var options = {
    zoom: {
        controls: false,
        wheel: false,
        startScale: 0.8,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    },
    toolbox: toolbox,
    collapse: true,
    comments: true,
    disable: true,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: 'end',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    renderer: 'zelos'
};

/* Inject your workspace */
var workspace = Blockly.inject("blocklyDiv", options);
Blockly.JavaScript.init(workspace);
Blockly.BlockSvg.START_HAT = true;
var blocks = [
    {
        "type": "start",
        "message0": "start",
        "nextStatement": null,
        "colour": "#FFBF00",
        "tooltip": "Punto de inicio del programa",
        "helpUrl": ""

    }
    , {
        "type": "repeat",
        "message0": "repeat %1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "NAME"
            },
            {
                "type": "input_end_row"
            },
            {
                "type": "input_statement",
                "name": "REPEAT"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#FFAB19",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "fd",
        "message0": "FD %1",
        "args0": [
            {
                "type": "input_value",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": '#4C97FF',
        "tooltip": "",
        "helpUrl": ""
    }
    ,
    {
        "type": "bk",
        "message0": "bk %1",
        "args0": [
            {
                "type": "input_value",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "rt",
        "message0": "rt %1",
        "args0": [
            {
                "type": "input_value",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "lt",
        "message0": "lt %1",
        "args0": [
            {
                "type": "input_value",
                "name": "NAME"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF",
        "tooltip": "",
        "helpUrl": ""
    },

    {
        "type": "home",
        "message0": "home",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "setxy",
        "message0": "setxy %1 %2",
        "args0": [
            {
                "type": "field_number",
                "name": "x",
                "value": 0,
                "min": 0,
                "max": 500
            },
            {
                "type": "field_number",
                "name": "y",
                "value": 0,
                "min": 0,
                "max": 500
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "pu",
        "message0": "pu",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "9966FF",
        "tooltip": "",
        "helpUrl": ""

    },
    {
        "type": "pd",
        "message0": "pd",
        "previousStatement": null,
        "nextStatement": null,
        "colour": "9966FF",
        "tooltip": "",
        "helpUrl": ""

    },
    {
        "type": "color",
        "message0": "color %1",
        "args0": [
            {
                "type": "field_number",
                "name": "COLOR",
                "value": 16,
                "min": 1,
                "max": 16
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF",
        "tooltip": "",
        "helpUrl": ""
    },

    {
        "type": "setpensize",
        "message0": "setpensize %1",
        "args0": [
            {
                "type": "field_number",
                "name": "SETPENSIZE",
                "value": 3,
                "min": 1,
                "max": 1000
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF",
        "tooltip": "",
        "helpUrl": ""
    },
    {
        "type": "math_add",
        "message0": "%1 + %2",
        "args0": [
            {
                "type": "input_value",
                "name": "A",
                "check": "Number",
                "shadow": {
                    "type": "math_number",
                    "fields": {
                        "NUM": 1
                    }
                }
            },
            {
                "type": "input_value",
                "name": "B",
                "check": "Number",
                "shadow": {
                    "type": "math_number",
                    "fields": {
                        "NUM": 1
                    }
                }
            }
        ],
        "inputsInline": true,
        "output": "Number",
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
    }


];
Blockly.defineBlocksWithJsonArray(blocks);



function loadWorkspace(workspace, filename) {
    fetch(filename)
        .then(response => response.text())
        .then(data => {
            var xml = Blockly.utils.xml.textToDom(data);
            Blockly.Xml.domToWorkspace(xml, workspace);
        })
        .catch(error => console.error('Error:', error));
}

loadWorkspace(workspace, '/../../xml/workspace.xml');


function reiniciarBlockly() {
    // Destruir el espacio de trabajo actual si existe
    if (workspace) {
        workspace.dispose();
    }

    // Cargar el nuevo XML del toolbox
    fetch('/../../xml/toolbox.xml')
        .then(response => response.text())
        .then(data => {
            // Crear un nuevo espacio de trabajo con el toolbox actualizado
            var toolbox = Blockly.utils.xml.textToDom(data);
            options.toolbox = toolbox; // Actualiza la opción toolbox con el nuevo XML
            workspace = Blockly.inject("blocklyDiv", options); // Inyecta el nuevo espacio de trabajo
            Blockly.JavaScript.init(workspace);
        })
        .catch(error => console.error('Error al cargar toolbox:', error));
}

// Llamar a la función para reiniciar Blockly
reiniciarBlockly();
