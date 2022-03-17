import React from "react";
import {default as CanvasJSReact} from "./canvasjs.react.js";
import './StaffInterface.css'

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Statistics() {
    const weeklyIncomeHireOptions = {
        title: {
            text: "Weekly Income (hire options)",
            fontFamily: "arial",
            fontWeight: "bold"
        },
        axisY: {
            title: "Income",
            prefix: "£"
        },
        axisX: {
            title: "Week"
        },
        data: [
            {
                name: "1 hour",
                legendText: "1 hour",
                showInLegend: true,
                type: "line",
                dataPoints:
                    [
                        {label: "Week 1", y: 10},
                        {label: "Week 2", y: 20},
                        {label: "Week 3", y: 30},
                        {label: "Week 4", y: 40},
                        {label: "Week 5", y: 40},
                        {label: "Week 6", y: 40},
                        {label: "Week 7", y: 40}
                    ]
            },
            {
                name: "4 hours",
                legendText: "4 hours",
                showInLegend: true,
                type: "line",
                dataPoints:
                    [
                        {label: "Week 1", y: 35},
                        {label: "Week 2", y: 66},
                        {label: "Week 3", y: 84},
                        {label: "Week 4", y: 95},
                        {label: "Week 5", y: 36},
                        {label: "Week 6", y: 24},
                        {label: "Week 7", y: 52}
                    ]
            },
            {
                name: "1 day",
                legendText: "1 day",
                showInLegend: true,
                type: "line",
                dataPoints:
                    [
                        {label: "Week 1", y: 112},
                        {label: "Week 2", y: 86},
                        {label: "Week 3", y: 113},
                        {label: "Week 4", y: 67},
                        {label: "Week 5", y: 58},
                        {label: "Week 6", y: 96},
                        {label: "Week 7", y: 45}
                    ]
            },
            {
                name: "1 week",
                legendText: "1 week",
                showInLegend: true,
                type: "line",
                dataPoints:
                    [
                        {label: "Week 1", y: 280},
                        {label: "Week 2", y: 130},
                        {label: "Week 3", y: 160},
                        {label: "Week 4", y: 88},
                        {label: "Week 5", y: 75},
                        {label: "Week 6", y: 172},
                        {label: "Week 7", y: 165}
                    ]
            }
        ]
    };
    const weeklyIncome = {
        title: {
            text: "Weekly Income",
            fontFamily: "arial",
            fontWeight: "bold"
        },
        axisY: {
            title: "Income",
            prefix: "£"
        },
        axisX: {
            title: "Week"
        },
        data: [
            {
                type: "line",
                dataPoints:
                    [
                        {label: "Week 1", y: 280},
                        {label: "Week 2", y: 130},
                        {label: "Week 3", y: 160},
                        {label: "Week 4", y: 88},
                        {label: "Week 5", y: 75},
                        {label: "Week 6", y: 172},
                        {label: "Week 7", y: 165}
                    ]
            }
        ]
    };
    const dailyCombinedIncome = {
        animationEnabled: true,
        title: {
            text: "Daily Combined Income",
            fontFamily: "arial",
            fontWeight: "bold"
        },
        axisY: {
            title: "Income",
            prefix: "£"
        },
        axisX: {
            title: "Day"
        },
        toolTip: {
            shared: true
        },
        data: [
            {
                name: "1 hour",
                legendText: "1 hour",
                showInLegend: true,
                type: "column",
                dataPoints:
                    [
                        {label: "Monday", y: 10},
                        {label: "Tuesday", y: 20},
                        {label: "Wednesday", y: 30},
                        {label: "Thursday", y: 40},
                        {label: "Friday", y: 40},
                        {label: "Saturday", y: 40},
                        {label: "Sunday", y: 40}
                    ]
            },
            {
                name: "4 hours",
                legendText: "4 hours",
                showInLegend: true,
                type: "column",
                dataPoints:
                    [
                        {label: "Monday", y: 35},
                        {label: "Tuesday", y: 66},
                        {label: "Wednesday", y: 84},
                        {label: "Thursday", y: 95},
                        {label: "Friday", y: 36},
                        {label: "Saturday", y: 24},
                        {label: "Sunday", y: 52}
                    ]
            },
            {
                name: "1 day",
                legendText: "1 day",
                showInLegend: true,
                type: "column",
                dataPoints:
                    [
                        {label: "Monday", y: 112},
                        {label: "Tuesday", y: 86},
                        {label: "Wednesday", y: 113},
                        {label: "Thursday", y: 67},
                        {label: "Friday", y: 58},
                        {label: "Saturday", y: 96},
                        {label: "Sunday", y: 45}
                    ]
            }
        ]
    };
    return (
        <>
            <h1>Statistics</h1>
            <div className="scroll">
                {[weeklyIncomeHireOptions, weeklyIncome, dailyCombinedIncome].map((graph, idx) => (
                    <CanvasJSChart key={idx} options={graph}/>
                ))}
            </div>
        </>
    );
}

export default Statistics;