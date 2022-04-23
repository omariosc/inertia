import React, {useEffect, useState} from "react";
import {default as CanvasJSReact} from "../../canvasjs.react.js";
import host from "../../host";
import Cookies from "universal-cookie";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function ManagerStatistics() {
    const cookies = new Cookies();
    const [weeklyData, setWeeklyData] = useState('');
    const [weeklyHiresData, setWeeklyHiresData] = useState('');
    const [combinedDailyData, setCombinedDailyData] = useState('');

    useEffect(() => {
        fetchStatistics();
    }, []);

    async function fetchStatistics() {
        const init = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        }
        try {
            let weeklyDataRequest = await fetch(host + "api/admin/Plot/weekly?separateHireOptions=true", init);
            setWeeklyData(await weeklyDataRequest.json());
            let weeklyHiresDataRequest = await fetch(host + "api/admin/Plot/weekly?separateHireOptions=false", init);
            setWeeklyHiresData(await weeklyHiresDataRequest.json());
            let combinedDailyDataRequest = await fetch(host + "api/admin/Plot/combinedDaily", init);
            setCombinedDailyData(await combinedDailyDataRequest.json());
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h3 id={"pageName"}>Statistics</h3>
            <br/>
            <div className="scroll">
                {(weeklyData === '') ?
                    <h6>Loading weekly hire options graph...</h6> :
                    <>
                        <CanvasJSChart options={
                            {
                                theme: "light2",
                                animationEnabled: true,
                                title: {
                                    text: "Weekly Income (Hire Options)",
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
                                                {label: "Week 1", y: weeklyData.yAxis[0].values[0]},
                                                {label: "Week 2", y: weeklyData.yAxis[0].values[1]},
                                                {label: "Week 3", y: weeklyData.yAxis[0].values[2]},
                                                {label: "Week 4", y: weeklyData.yAxis[0].values[3]},
                                                {label: "Week 5", y: weeklyData.yAxis[0].values[4]},
                                                {label: "Week 6", y: weeklyData.yAxis[0].values[5]},
                                                {label: "Week 7", y: weeklyData.yAxis[0].values[6]}
                                            ]
                                    },
                                    {
                                        name: "4 hours",
                                        legendText: "4 hours",
                                        showInLegend: true,
                                        type: "line",
                                        dataPoints:
                                            [
                                                {label: "Week 1", y: weeklyData.yAxis[1].values[0]},
                                                {label: "Week 2", y: weeklyData.yAxis[1].values[1]},
                                                {label: "Week 3", y: weeklyData.yAxis[1].values[2]},
                                                {label: "Week 4", y: weeklyData.yAxis[1].values[3]},
                                                {label: "Week 5", y: weeklyData.yAxis[1].values[4]},
                                                {label: "Week 6", y: weeklyData.yAxis[1].values[5]},
                                                {label: "Week 7", y: weeklyData.yAxis[1].values[6]}
                                            ]
                                    },
                                    {
                                        name: "1 day",
                                        legendText: "1 day",
                                        showInLegend: true,
                                        type: "line",
                                        dataPoints:
                                            [
                                                {label: "Week 1", y: weeklyData.yAxis[2].values[0]},
                                                {label: "Week 2", y: weeklyData.yAxis[2].values[1]},
                                                {label: "Week 3", y: weeklyData.yAxis[2].values[2]},
                                                {label: "Week 4", y: weeklyData.yAxis[2].values[3]},
                                                {label: "Week 5", y: weeklyData.yAxis[2].values[4]},
                                                {label: "Week 6", y: weeklyData.yAxis[2].values[5]},
                                                {label: "Week 7", y: weeklyData.yAxis[2].values[6]}
                                            ]
                                    },
                                    {
                                        name: "1 week",
                                        legendText: "1 week",
                                        showInLegend: true,
                                        type: "line",
                                        dataPoints:
                                            [
                                                {label: "Week 1", y: weeklyData.yAxis[3].values[0]},
                                                {label: "Week 2", y: weeklyData.yAxis[3].values[1]},
                                                {label: "Week 3", y: weeklyData.yAxis[3].values[2]},
                                                {label: "Week 4", y: weeklyData.yAxis[3].values[3]},
                                                {label: "Week 5", y: weeklyData.yAxis[3].values[4]},
                                                {label: "Week 6", y: weeklyData.yAxis[3].values[5]},
                                                {label: "Week 7", y: weeklyData.yAxis[3].values[6]}
                                            ]
                                    }
                                ]
                            }
                        }
                        />
                        <br/>
                        <br/>
                    </>
                }
                {(weeklyHiresData === '') ?
                    <h6>Loading combined weekly graph...</h6> :
                    <>
                        <CanvasJSChart options={
                            {
                                theme: "light2",
                                animationEnabled: true,
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
                                                {label: "Week 1", y: weeklyHiresData.yAxis[0].values[0]},
                                                {label: "Week 2", y: weeklyHiresData.yAxis[0].values[1]},
                                                {label: "Week 3", y: weeklyHiresData.yAxis[0].values[2]},
                                                {label: "Week 4", y: weeklyHiresData.yAxis[0].values[3]},
                                                {label: "Week 5", y: weeklyHiresData.yAxis[0].values[4]},
                                                {label: "Week 6", y: weeklyHiresData.yAxis[0].values[5]},
                                                {label: "Week 7", y: weeklyHiresData.yAxis[0].values[6]}
                                            ]
                                    }
                                ]
                            }
                        }
                        />
                        <br/>
                        <br/>
                    </>
                }
                {(combinedDailyData === '') ?
                    <h6>Loading combined daily graph...</h6> :
                    <>
                        <CanvasJSChart options={
                            {
                                theme: "light2",
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
                                                {label: "Monday", y: combinedDailyData.barData[1][0]},
                                                {label: "Tuesday", y: combinedDailyData.barData[1][1]},
                                                {label: "Wednesday", y: combinedDailyData.barData[1][2]},
                                                {label: "Thursday", y: combinedDailyData.barData[1][3]},
                                                {label: "Friday", y: combinedDailyData.barData[1][4]},
                                                {label: "Saturday", y: combinedDailyData.barData[1][5]},
                                                {label: "Sunday", y: combinedDailyData.barData[1][6]}
                                            ]
                                    },
                                    {
                                        name: "4 hours",
                                        legendText: "4 hours",
                                        showInLegend: true,
                                        type: "column",
                                        dataPoints:
                                            [
                                                {label: "Monday", y: combinedDailyData.barData[2][0]},
                                                {label: "Tuesday", y: combinedDailyData.barData[2][1]},
                                                {label: "Wednesday", y: combinedDailyData.barData[2][2]},
                                                {label: "Thursday", y: combinedDailyData.barData[2][3]},
                                                {label: "Friday", y: combinedDailyData.barData[2][4]},
                                                {label: "Saturday", y: combinedDailyData.barData[2][5]},
                                                {label: "Sunday", y: combinedDailyData.barData[2][6]}
                                            ]
                                    },
                                    {
                                        name: "1 day",
                                        legendText: "1 day",
                                        showInLegend: true,
                                        type: "column",
                                        dataPoints:
                                            [
                                                {label: "Monday", y: combinedDailyData.barData[3][0]},
                                                {label: "Tuesday", y: combinedDailyData.barData[3][1]},
                                                {label: "Wednesday", y: combinedDailyData.barData[3][2]},
                                                {label: "Thursday", y: combinedDailyData.barData[3][3]},
                                                {label: "Friday", y: combinedDailyData.barData[3][4]},
                                                {label: "Saturday", y: combinedDailyData.barData[3][5]},
                                                {label: "Sunday", y: combinedDailyData.barData[3][6]}
                                            ]
                                    }
                                ]
                            }
                        }
                        />
                    </>
                }
            </div>
        </>
    );
};