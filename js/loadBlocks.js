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
    toolboxPosition: 'start',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    renderer: "zelos"
};

/* Inject your workspace */
var workspace = Blockly.inject("blocklyDiv", options);


var blocks = [{
    "type": "repeat",
    "message0": "REPEAT %1 %2 %3",
    "args0": [
        {
            "type": "field_number",
            "name": "REPEAT",
            "value": 1,
            "min": 1,
            "max": 360
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
    "colour": 100,
    "tooltip": "",
    "helpUrl": ""
},
{
    "type": "fd",
    "message0": "FD %1",
    "args0": [
        {
            "type": "field_number",
            "name": "FD",
            "value": 0,
            "min": 0,
            "max": 1000
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
},
{
    "type": "bk",
    "message0": "BK %1",
    "args0": [
        {
            "type": "field_number",
            "name": "BK",
            "value": 0,
            "min": 0,
            "max": 1000
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
},
{
    "type": "rt",
    "message0": "RT %1",
    "args0": [
        {
            "type": "field_number",
            "name": "RT",
            "value": 0,
            "min": 0,
            "max": 360
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
},
{
    "type": "lt",
    "message0": "LT %1",
    "args0": [
        {
            "type": "field_number",
            "name": "LT",
            "value": 0,
            "min": 0,
            "max": 360
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
},

{
    "type": "color",
    "message0": "COLOR %1",
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
    "colour": 20,
    "tooltip": "",
    "helpUrl": ""
}];

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

loadWorkspace(workspace, '/workspace.xml');

function loadToolbox(workspace, filename) {
    fetch(filename)
        .then(response => response.text())
        .then(data => {
            workspace.updateToolbox(data);
        })
        .catch(error => console.error('Error:', error));
}

loadToolbox(workspace, '/toolbox.xml');
