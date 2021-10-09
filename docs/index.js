// Task 1: Interactive Visualisation
// Create a visualisation of your choice with the following interactions:
// o Tooltips,
// o Text/lineannotations,and
// o One of the following filtering options (check the week-9 studio activities
// for references)
// ▪ Selection on the legend
// ▪ Filtering with a selection menu
// ▪ Filtering with a slider

// Task 2: HTML Page
// Construct an HTML page that includes at least two visualisations. 
// This could be the map that you created in the week 9 homework and 
// the visualisation you created in Task 1 of this homework.


// TODO: ADD PERCENTAGES
const VegaLiteSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    title: "Australian Internet Speeds over Time",
    data: {
        url: "data/internet_activity/internet_speeds.csv",
        format: {
            type: "csv"
        }
    },
    params: [{
        name: "speed_selection",
        bind: {
            input: "select",
            options: [
                null,
                "< 256kbps",
                "256kbps - 512kbps",
                "512kbps - 1.5Mbps",
                "1.5Mbps - 8Mbps",
                "8Mbps - 24Mbps",
                "> 24Mbps",
            ],
            labels: [
                "Show All",
                "< 256kbps",
                "256kbps - 512kbps",
                "512kbps - 1.5Mbps",
                "1.5Mbps - 8Mbps",
                "8Mbps - 24Mbps",
                "> 24Mbps",
            ],
            name: "Speed Selection: "
        }
    }],
    transform: [{
        filter: "speed_selection == null || datum.speed == speed_selection"
    },
    {
        calculate: "if(datum.speed === '< 256kbps', 0, if(datum.speed === '256kbps - 512kbps',1, if(datum.speed === '512kbps - 1.5Mbps', 2, if(datum.speed === '1.5Mbps - 8Mbps', 3, if(datum.speed === '8Mbps - 24Mbps', 4, if(datum.speed === '> 24Mbps', 5, 6))))))",
        as: "speedOrder",
    },
    {
        joinaggregate: [{
            op: "sum",
            field: "num_users",
            as: "total_num_users"
        }],
        groupby: ["year"]
    },
    {
        calculate: "datum.num_users * 1000",
        as: "real_num_users",
    },
    {
        calculate: "datum.total_num_users * 1000",
        as: "real_total_num_users",
    },
    {
        calculate: "datum.num_users / datum.total_num_users * 100",
        as: "percent_of_users",
    }],
    vconcat: [{
        width: 800,
        height: 500,
        mark: {
            type: "bar",
        },
        selection: {
            speed_highlight: {
                type: "multi",
                fields: ["speed"],
                bind: "legend"
            }
        },
        encoding: {
            x: {
                field: "year",
                type: "ordinal",
                title: "Year",
                scale: {
                    domain: {
                        param: "brush"
                    }
                },
            },
            y: {
                field: "num_users",
                aggregate: "sum",
                type: "quantitative",
                title: "Total Number of Internet Users [thousands]",
            },
            color: {
                field: "speed",
                title: "Speed Ranges",
                scale: {
                    domain: ["< 256kbps", "256kbps - 512kbps", "512kbps - 1.5Mbps", "1.5Mbps - 8Mbps", "8Mbps - 24Mbps", "> 24Mbps"],
                    range: ["#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#91003f"],
                    type: "ordinal",
                },
            },
            opacity: {
                condition: { selection: "speed_highlight", value: 1 },
                value: 0.3
            },
            order: {
                field: "speedOrder"
            },
            tooltip: [
                { field: "year", type: "ordinal", title: "Year" },
                { field: "speed", type: "ordinal", title: "Speed Tier" },
                { field: "percent_of_users", type: "quantitative", title: "Percent at this Speed Tier (\%)", format: ".1f" },
                { field: "real_num_users", type: "quantitative", title: "Number of Users", format: ",.0f" },
            ]
        }
    },
    {
        width: 800,
        height: 100,
        mark: {
            type: "area",
        },
        params: [{
            name: "brush",
            select: { type: "interval", encodings: ["x"] }
        }],
        encoding: {
            x: {
                field: "year",
                type: "ordinal",
                title: "Year"
            },
            y: {
                field: "total_num_users",
                aggregate: "sum",
                type: "quantitative",
                title: "Total Number of Internet Users [thousands]",
            },
            // color: "#d4b9da",
            tooltip: [
                { field: "year", type: "ordinal", title: "Year" },
                { field: "real_total_num_users", type: "quantitative", title: "Total number of Users", format: ",.0f" },
            ],
        }
    }]
}


vegaEmbed('#vis', VegaLiteSpec);
