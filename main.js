let DG = new jsnx.DiGraph();

$.getJSON('json_files/Abortion.json', function (data) {
    console.log(data);

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
    console.log(DG);
    jsnx.draw(DG, {
        element: '#graph-viz',
        layoutAttr: {
            linkDistance: 200
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
});


$(document).ready(function () {

    $('#node-nb').text(1);
    $('#desc').text(DG.node.get(1).text);
    $('#node-nb-2').text(1);
    $('#desc-2').text(DG_essay.node.get(1).text);

    $(document).mousemove(function (e) {
        let cpos = {top: e.pageY + 10, left: e.pageX + 10};
        $('#besideMouse').offset(cpos);
    });


    $("#graph-viz .node").click(function () {
            var nodeId = Number($(this).find('.g-node').attr('id'));
            $('#node-nb').text(nodeId);
            $('#desc').text(DG.node.get(nodeId).text);
            $('.g-node').css({stroke: 'rgb(51, 51, 51)'});
            $(this).find('.g-node').css({stroke: "#ff5bbd"});

        }
    );

    $("#graph-viz .node").hover(function () {
        var nodeId = Number($(this).find('.g-node').attr('id'));
        $('#besideMouse').text(DG.node.get(nodeId).text);

    }, function () {
        $('#besideMouse').text("");
    });

    $("#graph-viz-2 .node").click(function () {
        let nodeId = $(this).find('.g-node').attr('id');
        nodeId = Number(nodeId.substring(3));
        $('#node-nb-2').text(nodeId);
        $('#desc-2').text(DG_essay.node.get(nodeId).text);
        $('#graph-viz-2 .g-node').css({stroke: 'rgb(51, 51, 51)'});
        $(this).find('.g-node').css({stroke: "#ff5bbd"});

        }
    );

    $("#graph-viz-2 .node").hover(function () {

        let nodeId = $(this).find('.g-node').attr('id');
        nodeId = Number(nodeId.substring(3));
        $('#besideMouse').text(DG_essay.node.get(nodeId).text);

    }, function () {
        $('#besideMouse').text("");
    });

});


//essays
let essay_text = "";
let starts = [];
let ends = [];

$.get('essay_texts/essay01.txt', function(data) {
    essay_text = data;
}, 'text');

let DG_essay = new jsnx.DiGraph();

$.getJSON('json_files_2/essay_graph_0.json', function (data) {

    DG_essay.graph = data.graph.topic;
    $("#graph-topic-2").text(String(DG_essay.graph));

    for (node of data.nodes) {
        starts.push({entity: node.entity, start: Number(node.start), end: Number(node.end)});

        if (node.entity === 'MajorClaim') {
            DG_essay.addNode(Number(node.id), {text: node.text, end: node.end, start: node.start, color: 'yellow', radius: 20});
        }
        if (node.entity === 'Claim') {
            DG_essay.addNode(Number(node.id), {text: node.text, end: node.end, start: node.start, color: 'orange', radius: 16});
        }
        if (node.entity === 'Premise') {
            DG_essay.addNode(Number(node.id), {text: node.text, end: node.end, start: node.start, color: 'lightblue', radius: 10});
        }

    }
    for (edge of data.links) {
        if (edge.entailment === 1) {
            DG_essay.addEdge(Number(edge.source), Number(edge.target), {color: 'green'});
        } else {
            DG_essay.addEdge(Number(edge.source), Number(edge.target), {color: 'red'});
        }

    }

    jsnx.draw(DG_essay, {
        element: '#graph-viz-2',
        layoutAttr: {
            linkDistance: 200
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
            class: 'g-node'
        }


    });

    highlight_text(essay_text, starts);
});

function highlight_text(essay_original, starts){
    let essay_html = "";
    let ind = 0;
    let temp = "";
    starts.sort(function (a, b) {
        return a.start - b.start;
    });
    for (let i = 0; i < starts.length; i++) {
        essay_html += essay_original.substring(ind, starts[i].start);
        temp = "<span class=\"" + starts[i].entity + "\" >" + essay_original.substring(starts[i].start, starts[i].end) + "</span>";
        essay_html += temp;
        ind = starts[i].end + 1;
    }
    essay_html += essay_original.substring(ind);
    $('#annotated-text').empty();
    $('#annotated-text').append(essay_html);
}

$( "#reload-text" ).click(function() {
    highlight_text(essay_text, starts);
});