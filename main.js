$(document).ready(function () {


    $(document).mousemove(function (e) {
        let cpos = {top: e.pageY + 10, left: e.pageX + 10};
        $('#besideMouse').offset(cpos);
    });

    $(document).on("click", "#graph-viz .node", function(){
        var nodeId = Number($(this).find('.g-node').attr('id'));
        $('#node-nb').text(nodeId);
        $('#desc').text(DG.node.get(nodeId).text);
        $('.g-node').css({stroke: 'rgb(51, 51, 51)'});
        $(this).find('.g-node').css({stroke: "#ff5bbd"});
    });

    $(document).on({
        mouseenter: function () {
            var nodeId = Number($(this).find('.g-node').attr('id'));
            $('#besideMouse').text(DG.node.get(nodeId).text);
        },
        mouseleave: function () {
            $('#besideMouse').text("");
        }
    }, "#graph-viz .node");

    $(document).on("click", "#graph-viz-2 .node", function(){
            let nodeId = $(this).find('.g2-node').attr('id');
            nodeId = Number(nodeId.substring(3));
            $('#node-nb-2').text(nodeId);
            $('#desc-2').text(DG_essay.node.get(nodeId).text);
            $('#graph-viz-2 .g2-node').css({stroke: 'rgb(51, 51, 51)'});
            $(this).find('.g2-node').css({stroke: "#ff5bbd"});

        }
    );

    $(document).on({
        mouseenter: function () {
            let nodeId = $(this).find('.g2-node').attr('id');
            nodeId = Number(nodeId.substring(3));
            $('#besideMouse').text(DG_essay.node.get(nodeId).text);
        },
        mouseleave: function () {
            $('#besideMouse').text("");
        }
    }, "#graph-viz-2 .node");

});

/***Debatepedia****/
let DG;

function loadDebatepedia(topic) {
    DG = new jsnx.DiGraph();
    $.getJSON('json_files/' + topic + '.json', function (data) {
        DG.graph = data.graph.topic;
        $("#graph-topic").text(String(DG.graph));
        for (node of data.nodes) {
            DG.addNode(Number(node.id), {text: node.text, label: node.text.substring(0, 10)});
        }
        for (edge of data.links) {
            if (edge.entailment === 1) {
                DG.addEdge(Number(edge.source), Number(edge.target), {color: 'green'});
            } else {
                DG.addEdge(Number(edge.source), Number(edge.target), {color: 'red'});
            }

        }
        jsnx.draw(DG, {
            element: '#graph-viz',
            layoutAttr: {
                linkDistance: 100
            },
            withLabels: true,
            //labels:  'label',
            edgeStyle: {
                fill: function (d) {
                    return d.data.color
                }
            },
            nodeStyle: {
                fill: '#d2e0f7'
            },
            nodeAttr: {
                r: 10,
                id: function (d) {
                    return d.node; // assign unique ID
                },
                class: function (d) {
                    return 'g-node';
                }

            }

        });

        $('#node-nb').text(1);
        $('#desc').text(DG.node.get(1).text);

    });
}

loadDebatepedia('Abortion');

$('.topic').click(function () {
    $(".g-node").remove();
    loadDebatepedia($(this).text());
});



//essays
let essay_text = "";
let starts = [];
let ends = [];

$('.essay').click(function () {
    $(".g2-node").remove();
    $("#annotated-text").empty();
    $('#desc-2').text("");
    loadEssayData($(this).text());
});


let DG_essay;
function loadEssayData(essaynumber) {
    DG_essay = new jsnx.DiGraph();
    //essays
    essay_text = "";
    starts = [];
    ends = [];

    $.getJSON('json_files_2/'+ essaynumber +'_.json', function (data) {


        $.get('essay_texts/'+ essaynumber +'.txt', function (data) {
            essay_text = data;
        }, 'text');


        DG_essay.graph = data.graph.topic;
        $("#graph-topic-2").text(String(DG_essay.graph));

        for (node of data.nodes) {
            starts.push({entity: node.entity, start: Number(node.start), end: Number(node.end)});

            if (node.entity === 'MajorClaim') {
                DG_essay.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'yellow',
                    radius: 20
                });
            }
            if (node.entity === 'Claim') {
                DG_essay.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'orange',
                    radius: 16
                });
            }
            if (node.entity === 'Premise') {
                DG_essay.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'lightblue',
                    radius: 10
                });
            }

        }
        for (edge of data.links) {
            if (edge.entailment === 1) {
                DG_essay.addEdge(edge.source, edge.target, {color: 'green'});
            } else {
                DG_essay.addEdge(edge.source, edge.target, {color: 'red'});
            }

        }

        jsnx.draw(DG_essay, {
            element: '#graph-viz-2',
            layoutAttr: {
                linkDistance: 100
            },
            withLabels: true,
            //labels:  'label',
            edgeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            nodeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            nodeAttr: {
                r: function (d) {
                    return d.data.radius;
                },
                id: function (d) {
                    return 'G2-' + d.node; // assign unique ID
                },
                class: 'g2-node'
            }


        });
        $('#node-nb-2').text(1);
        $('#desc-2').text(DG_essay.node.get(1).text);
    });



}

loadEssayData('essay01');

function highlight_text(essay_original, starts) {
    let essay_html = "";
    let ind = 0;
    let temp = "";
    let color ="";
    starts.sort(function (a, b) {
        return a.start - b.start;
    });
    for (let i = 0; i < starts.length; i++) {
        essay_html += essay_original.substring(ind, starts[i].start);
        if(starts[i].entity === "MajorClaim"){color = 'yellow'}
        if(starts[i].entity === "Claim"){color = 'orange'}
        if(starts[i].entity === "Premise"){color = 'lightblue'}
        temp = '<span style="background-color: ' + color + '" >' + essay_original.substring(starts[i].start, starts[i].end) + "</span>";
        essay_html += temp;
        ind = starts[i].end + 1;
    }
    essay_html += essay_original.substring(ind);

    $('#annotated-text').html(essay_html);

}

$("#reload-text").click(function () {
    $('#annotated-text').empty();
    highlight_text(essay_text, starts);
});


/****SPEECHES***/
let CamLines = [];
let CamLabels = [];
let CleLines = [];
let CleLabels = [];
let MilLines = [];
let MilLabels = [];

$("#reload-speech-1").click(function () {
    highlight_speech(1);
    console.log('clicky');
});
$("#reload-speech-2").click(function () {
    highlight_speech(2);
    console.log('clicky');
});
$("#reload-speech-3").click(function () {
    highlight_speech(3);
    console.log('clicky');
});


$.get('speeches/Cameron.txt', function (data) {
    CamLines = data.split("\n");
}, 'text');
$.get('speeches/CameronLabels.txt', function (data) {
    CamLabels = data.split("\n");

}, 'text');
$.get('speeches/Clegg.txt', function (data) {
    CleLines = data.split("\n");
}, 'text');
$.get('speeches/CleggLabels.txt', function (data) {
    CleLabels = data.split("\n");

}, 'text');
$.get('speeches/Miliband.txt', function (data) {
    MilLines = data.split("\n");
}, 'text');
$.get('speeches/MilibandLabels.txt', function (data) {
    MilLabels = data.split("\n");

}, 'text');

function highlight_speech(politician) {
    let lines = [];
    let labels = [];
    switch (politician) {
        case 1:
            lines = CamLines;
            labels = CamLabels;
            break;
        case 2:
            lines = CleLines;
            labels = CleLabels;
            break;
        case 3:
            lines = MilLines;
            labels = MilLabels;
            break;
    }


    let speech_html = "";
    for (let i = 0; i < lines.length; i++) {
        if (i < 9) {
            if (labels[i] === 'C') {
                speech_html += '<span style="background-color: orange" >' + lines[i].substring(1) + '</span>';
            }
            speech_html += lines[i].substring(1);
        }
        else if (i < 99) {
            if (labels[i] === 'C') {
                speech_html += '<span  style="background-color: orange" >' + lines[i].substring(2) + '</span>';
            }
            speech_html += lines[i].substring(2);
        }
        else if (i < 999) {
            if (labels[i] === 'C') {
                speech_html += '<span  style="background-color: orange" >' + lines[i].substring(3) + '</span>';
            }
            speech_html += lines[i].substring(3);
        }

    }
    $('#annotated-speech').empty();
    $('#annotated-speech').append(speech_html);


}