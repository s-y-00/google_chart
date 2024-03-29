// load library
google.load('visualization', '1', { 'packages': ['corechart'] });

// WebSocket
$(function ()
{
    // create data table
    var dt = new google.visualization.DataTable();
    dt.addColumn('number', 'time');
    dt.addColumn('number', 'sell');
    dt.addColumn('number', 'buy');
    dt.addColumn({ 'type': 'string', 'role': 'style' });

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
        var socket = new WebSocket("wss://ws.lightstream.bitflyer.com/json-rpc");
        var container = $("#containerDiv");
        var recentTrades = $("#recentTrades table tbody");
        socket.onopen = function ()
        {

            socket.send(JSON.stringify({ type: "subscribe", channel: "btc_jpy-trades" }));
        };
        socket.onopen = function ()
        {
            container.append("<p>Socket is open</p>");
            socket.send(JSON.stringify({
                method: "subscribe",
                params: {
                    channel: "lightning_executions_FX_BTC_JPY"  // executions BTCJPYFX
                }
            }));
        };

        socket.onmessage = function (e)
        {
            var response = JSON.parse(e.data);

            response.params.message.forEach(function (data)
            {

                var id = data['id'];
                var timestamp = new Date(data['exec_date']);
                var price = data['price'];
                var side = data['side'];
                var vol = data['size'];

                var datetime = new Date;

                var buy_color = '#109618';
                var sell_color = '#D32F2F';
                var color = (side == 'BUY' ? '#109618' : '#D32F2F')

                if (side == 'SELL')
                {
                    dt.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + sell_color + '}']);
                } else if (side == 'BUY')
                {
                    dt.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + buy_color + '}']);
                }

                // display options
                var options = {
                    title: 'executions',
                    titleTextStyle: {
                        color: '#FFF',
                    },
                    //legend: {position: 'none' },
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
                var chart = new google.visualization.ScatterChart(document.getElementById('chartDiv'));

                // draw chat
                chart.draw(dt, options);

                // display
                //container.append("<p>" + price + "</p>");
                var row = '';
                row += "<tr bgcolor=\"" + color + "\">";
                row += ("<td align=\"right\">" + price + "</td>")
                row += ("<td align=\"right\">" + vol + "</td>")
                row += ("<td align=\"right\">" + side + "</td>")
                row += ("</tr>")
                recentTrades.prepend(row);

                var num_rows = trades_tbl.rows.length;
                if (num_rows > 15)
                {
                    document.getElementById("trades_tbl").deleteRow(num_rows - 1);
                }
                deleterow("trades_tbl");

                dt_row_size = dt.getNumberOfRows();
                if (dt_row_size > 100)
                {
                    // remove oldest one
                    dt.removeRow(0);
                }
            });
        }

        socket.onclose = function ()
        {
            container.append("<p>Socket closed</p>");
        }
        return socket;
    }
});

function deleterow(tableID)
{
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;

    table.deleteRow(rowCount - 1);
}
