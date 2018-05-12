var G = new jsnx.DiGraph();

G.addNode(1);
var DG = new jsnx.DiGraph();


$.getJSON('json_files/Abortion.json', function (data) {
    console.log(data);

    DG.graph =  data.graph.topic;
    for (node of data.nodes){
        DG.addNode(Number(node.id), {text: node.text, label: node.text.substring(0, 10)});
    }
    for (edge of data.links){
        if(edge.entailment == 1){
            DG.addEdge(Number(edge.source), Number(edge.target), {color: 'green'});
        }else{
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
        nodeStyle:{
            fill: '#d2e0f7'
        },
        nodeAttr: {
            r: 10,
            id: function(d) {
                return  d.node; // assign unique ID
            },
            class: function(d) {
                return 'g-node';}

        }

    });
});



$( document ).ready(function() {
    $("#graph-topic").text(String(DG.graph));
    $('#node-nb').text(1)
    $('#desc').text(DG.node.get(1).text);


    $( ".node" ).click(function() {
            var nodeId = Number($(this).find('.g-node').attr('id'));
            $('#node-nb').text(nodeId)
            $('#desc').text(DG.node.get(nodeId).text);
            $('.g-node').css({ fill: '#d2e0f7' });
            $(this).find('.g-node').css({ fill: "#ceff84" });

        }
    );
    $(document).mousemove(function(e){
        var cpos = { top: e.pageY + 10, left: e.pageX + 10 };
        $('#besideMouse').offset(cpos);
    });

    $( ".node" ).hover(function() {
            var nodeId = Number($(this).find('.g-node').attr('id'));
            $('#node-nb').text(nodeId)
            $('#besideMouse').text(DG.node.get(nodeId).text);

        },function() {
            $('#besideMouse').text("");
        });



});