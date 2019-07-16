// load library
google.load('visualization', '1', { 'packages': ['corechart'] });

// WebSocket
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

                var buy_color = 'red';
                var sell_color = '#D32F2F';
                var color = (side == 'BUY' ? 'red' : '#D32F2F')

                if (side == 'SELL')
                {
                    data_table.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + sell_color + '}']);
                } else if (side == 'BUY')
                {
                    data_table.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + buy_color + '}']);
                }

                // display options
                var options = {
                    title: 'bitflyer BTC-FX/JPY',
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
                var chart = new google.visualization.ScatterChart(document.getElementById('fx_btc_jpy'));

                // draw chat
                chart.draw(data_table, options);

                // display
                var row = '';
                row += "<tr bgcolor=\"" + color + "\">";
                row += ("<td align=\"right\">" + price + "</td>")
                row += ("<td align=\"right\">" + vol + "</td>")
                row += ("<td align=\"right\">" + side + "</td>")
                row += ("</tr>")
                recentTrades.prepend(row);

                tbl_row_size = data_table.getNumberOfRows();
                if (tbl_row_size > 100)
                {
                    // remove oldest one
                    data_table.removeRow(0);
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
                    channel: "lightning_executions_BTC_JPY"  // executions BTCJPY
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

                var buy_color = 'red';
                var sell_color = '#D32F2F';
                var color = (side == 'BUY' ? 'red' : '#D32F2F')

                if (side == 'SELL')
                {
                    data_table.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + sell_color + '}']);
                } else if (side == 'BUY')
                {
                    data_table.addRow([timestamp.getTime(), side == 'SELL' ? Number(price) : null, side == 'BUY' ? Number(price) : null, 'point { fill-color: ' + buy_color + '}']);
                }

                // display options
                var options = {
                    title: 'bitflyer BTC/JPY',
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

                // display
                var row = '';
                row += "<tr bgcolor=\"" + color + "\">";
                row += ("<td align=\"right\">" + price + "</td>")
                row += ("<td align=\"right\">" + vol + "</td>")
                row += ("<td align=\"right\">" + side + "</td>")
                row += ("</tr>")
                recentTrades.prepend(row);

                tbl_row_size = data_table.getNumberOfRows();
                if (tbl_row_size > 100)
                {
                    // remove oldest one
                    data_table.removeRow(0);
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
