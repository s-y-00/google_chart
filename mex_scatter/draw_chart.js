// load library
google.load('visualization', '1', { 'packages': ['corechart'] });

$(function ()
{
    // create data table
    var data_table = new google.visualization.DataTable();
    data_table.addColumn('number', 'time');
    data_table.addColumn('number', 'sell');
    data_table.addColumn('number', 'buy');
    data_table.addColumn({ 'type': 'string', 'role': 'style' });

    var socket;
    if (window.WebSocket === undefined)
    {
        $("#container").append("Your browser does not support WebSockets");
        return;
    } else
    {
        socket = initSocket();
    }

    function initSocket()
    {
        var socket = new WebSocket("wss://www.bitmex.com/realtime");
        var container = $("#containerDiv");

        socket.onopen = function ()
        {
            container.append("<p>Socket is open</p>");
            socket.send(JSON.stringify({
                "op": "subscribe",
                "args": [
                    "trade:XBTUSD"
                ]
            }));
        };

        socket.onmessage = function (msg)
        {
            var response = JSON.parse(msg.data);

            if (response['data'])
            {
                response['data'].forEach(function (data)
                {
                    var timestamp = new Date(data['timestamp']);
                    var price = data['price'];
                    var side = data['side'];
                    var vol = data['size'];

                    var datetime = new Date;

                    var buy_color = 'green';
                    var sell_color = 'red';
                    var color = (side == 'Buy' ? 'green' : 'red')
                    console.log(side + color);
                    if (side == 'Sell')
                    {
                        data_table.addRow([
                            timestamp.getTime(),
                            side == 'Sell' ? Number(price) : null,
                            side == 'Buy' ? Number(price) : null,
                            'point { fill-color: ' + sell_color + '}'
                        ]);
                    } else if (side == 'Buy')
                    {
                        data_table.addRow([
                            timestamp.getTime(),
                            side == 'Sell' ? Number(price) : null,
                            side == 'Buy' ? Number(price) : null,
                            'point { fill-color: ' + buy_color + '}'
                        ]);
                    }

                    // display options
                    var options = {
                        title: 'bitMex XBT/USD',
                        titleTextStyle: {
                            color: '#FFF',
                        },
                        //legend: { position: 'none' },
                        legend: {
                            textStyle: {
                                color: 'white'
                            },
                            pagingTextStyle: { color: '#666' },
                            scrollArrows: 'none'
                        },
                        vAxis: {
                            scaleType: 'log',
                            textStyle: { color: '#FFF' },
                            gridlines: { color: '#696969' },
                        },
                        hAxis: {
                            textPosition: 'none',
                            scaleType: 'log',
                            textStyle: { color: '#FFF' },
                            gridlines: { color: '#696969' },
                        },
                        'backgroundColor': 'transparent',
                    };

                    // create bar chart
                    var chart = new google.visualization.ScatterChart(document.getElementById('btc_jpy'));

                    // draw chat
                    chart.draw(data_table, options);

                    tbl_row_size = data_table.getNumberOfRows();
                    if (tbl_row_size > 100)
                    {
                        // remove oldest one
                        data_table.removeRow(0);
                    }
                });
            }
        }

        socket.onclose = function ()
        {
            container.append("<p>Socket closed</p>");
        }
        return socket;
    }
});
