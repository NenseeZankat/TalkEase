import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell } from "recharts";
import { Card, CardContent } from "../components/Card";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChatAnalytics = () => {
    interface Analytics {
        labelCounts: Record<string, number>;
        activeHours: Record<string, number>;
        totalChats: number;
    }

    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const { chatCategoryId } = useParams<{ chatCategoryId: string }>();
    const userDetails = localStorage.getItem("user");

    if (!userDetails) {
        console.error("Error: USER data is missing in localStorage.");
        return <p className="text-center text-lg text-red-500">User data missing!</p>;
    }

    const userObject = JSON.parse(userDetails);
    const userId = userObject.id;

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/get-analytic/${userId}/${chatCategoryId}`);
                console.log("API Response:", response.data);
        
                if (!response.data.labelCounts || !response.data.activeHours) {
                    setAnalytics({ labelCounts: {}, activeHours: {}, totalChats: 0 });
                } else {
                    setAnalytics(response.data);
                }
            } catch (error) {
                console.error("API Fetch Error:", error);
                setAnalytics({ labelCounts: {}, activeHours: {}, totalChats: 0 });
            }
        };
        

        fetchAnalytics();
    }, [userId, chatCategoryId]);

    if (!analytics) return <p className="text-center text-lg">Loading analytics...</p>;

    if (analytics.totalChats === 0) {
        return (
            <div className="p-6 text-center text-lg font-semibold text-white">
                <h1 className="text-3xl font-bold">Chat Analytics</h1>
                <p className="mt-4 text-gray-400">No chats found for this category.</p>
            </div>
        );
    }

    const labelData = Object.entries(analytics.labelCounts).map(([label, count], index) => ({
        name: label,
        value: count,
        color: COLORS[index % COLORS.length],
    }));

    const activeHoursData = Object.entries(analytics.activeHours).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count: count,
    }));

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center text-white">Chat Analytics</h1>

            <Card>
                <CardContent className="p-2 text-xl font-semibold text-white bg-gray-800 rounded-lg shadow-md">
                    <div className="p-2 text-xl font-semibold text-white">Total Chats: {analytics.totalChats} </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Message Category Distribution</h2>
                        <PieChart width={350} height={350}>
                            <Pie data={labelData} dataKey="value" nameKey="name" outerRadius={130} innerRadius={60} paddingAngle={5}>
                                {labelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
                            <Legend verticalAlign="bottom" layout="horizontal" align="center" />
                        </PieChart>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Chat Activity by Hour</h2>
                        <BarChart width={450} height={320} data={activeHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                            <XAxis dataKey="hour" tick={{ fill: "white" }} />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="count" fill="#8884d8" barSize={40} radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default ChatAnalytics;
