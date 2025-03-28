// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell } from "recharts";
// import { Card, CardContent } from "../components/Card";
// import axios from "axios";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const ChatAnalytics = () => {
//     interface Analytics {
//         labelCounts: Record<string, number>;
//         activeHours: Record<string, number>;
//         totalChats: number;
//         moodTracking: Record<string, number>;
//         mentalHealth: Record<string, number>;
        
//     }

//     const [analytics, setAnalytics] = useState<Analytics | null>(null);
//     const { chatCategoryId } = useParams<{ chatCategoryId: string }>();
//     const userDetails = localStorage.getItem("user");

//     if (!userDetails) {
//         console.error("Error: USER data is missing in localStorage.");
//         return <p className="text-center text-lg text-red-500">User data missing!</p>;
//     }

//     const userObject = JSON.parse(userDetails);
//     const userId = userObject.id;

//     useEffect(() => {
//         const fetchAnalytics = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/chat/get-analytic/${userId}/${chatCategoryId}`);
//                 console.log("API Response:", response.data);
        
//                 if (!response.data.labelCounts || !response.data.activeHours) {
//                     setAnalytics({ labelCounts: {}, activeHours: {}, totalChats: 0 , moodTracking: {}, mentalHealth: {}});
//                 } else {
//                     setAnalytics(response.data);
//                 }
//             } catch (error) {
//                 console.error("API Fetch Error:", error);
//                 setAnalytics({ labelCounts: {}, activeHours: {}, totalChats: 0 , moodTracking: {}, mentalHealth: {}});
//             }
//         };
        

//         fetchAnalytics();
//     }, [userId, chatCategoryId]);

//     if (!analytics) return <p className="text-center text-lg">Loading analytics...</p>;

//     if (analytics.totalChats === 0) {
//         return (
//             <div className="p-6 text-center text-lg font-semibold text-white">
//                 <h1 className="text-3xl font-bold">Chat Analytics</h1>
//                 <p className="mt-4 text-gray-400">No chats found for this category.</p>
//             </div>
//         );
//     }

//     const labelData = Object.entries(analytics.labelCounts).map(([label, count], index) => ({
//         name: label,
//         value: count,
//         color: COLORS[index % COLORS.length],
//     }));

//     const activeHoursData = Object.entries(analytics.activeHours).map(([hour, count]) => ({
//         hour: `${hour}:00`,
//         count: count,
//     }));
//     const moodTrackingData = Object.entries(analytics.moodTracking).map(([mood, count]) => ({
//         name: mood,
//         value: count,
//     }));

//     const mentalHealthData = Object.entries(analytics.mentalHealth).map(([condition, count]) => ({
//         name: condition,
//         value: count,
//     }));

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-3xl font-bold text-center text-white">Chat Analytics</h1>

//             <Card>
//                 <CardContent className="p-2 text-xl font-semibold text-white bg-gray-800 rounded-lg shadow-md">
//                     <div className="p-2 text-xl font-semibold text-white">Total Chats: {analytics.totalChats} </div>
//                 </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                     <CardContent className="p-6 flex flex-col items-center">
//                         <h2 className="text-2xl font-bold text-white mb-4">Message Category Distribution</h2>
//                         <PieChart width={350} height={350}>
//                             <Pie data={labelData} dataKey="value" nameKey="name" outerRadius={130} innerRadius={60} paddingAngle={5}>
//                                 {labelData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
//                                 ))}
//                             </Pie>
//                             <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
//                             <Legend verticalAlign="bottom" layout="horizontal" align="center" />
//                         </PieChart>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardContent className="p-6 flex flex-col items-center">
//                         <h2 className="text-2xl font-bold text-white mb-4">Chat Activity by Hour</h2>
//                         <BarChart width={450} height={320} data={activeHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
//                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
//                             <XAxis dataKey="hour" tick={{ fill: "white" }} />
//                             <YAxis tick={{ fill: "white" }} />
//                             <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
//                             <Legend verticalAlign="top" height={36} />
//                             <Bar dataKey="count" fill="#8884d8" barSize={40} radius={[10, 10, 0, 0]} />
//                         </BarChart>
//                     </CardContent>
//                 </Card>
//             </div>
// {/* Mood Tracking Section */}
// {analytics.moodTracking && Object.keys(analytics.moodTracking).length > 0 && (
//                 <Card>
//                     <CardContent className="p-6 flex flex-col items-center">
//                         <h2 className="text-2xl font-bold text-white mb-4">Mood Tracking</h2>
//                         <PieChart width={350} height={350}>
//                             <Pie data={moodTrackingData} dataKey="value" nameKey="name" outerRadius={130} innerRadius={60} paddingAngle={5}>
//                                 {moodTrackingData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
//                                 ))}
//                             </Pie>
//                             <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
//                             <Legend verticalAlign="bottom" layout="horizontal" align="center" />
//                         </PieChart>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Mental Health Section */}
//             {analytics.mentalHealth && Object.keys(analytics.mentalHealth).length > 0 && (
//                 <Card>
//                     <CardContent className="p-6 flex flex-col items-center">
//                         <h2 className="text-2xl font-bold text-white mb-4">Mental Health Conditions</h2>
//                         <PieChart width={350} height={350}>
//                             <Pie data={mentalHealthData} dataKey="value" nameKey="name" outerRadius={130} innerRadius={60} paddingAngle={5}>
//                                 {mentalHealthData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
//                                 ))}
//                             </Pie>
//                             <Tooltip wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} />
//                             <Legend verticalAlign="bottom" layout="horizontal" align="center" />
//                         </PieChart>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default ChatAnalytics;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell } from "recharts";
import { Card, CardContent } from "../components/Card";
import axios from "axios";

// Emotion color palette
const EMOTION_COLORS: Record<string, string> = {
    "joy": "#FFD700",           // Gold
    "excitement": "#FF4081",    // Pink
    "love": "#E91E63",          // Deep Pink
    "surprise": "#9C27B0",      // Purple
    "anger": "#F44336",         // Red
    "sadness": "#2196F3",       // Blue
    "fear": "#673AB7",          // Deep Purple
    "disgust": "#795548",       // Brown
    "neutral": "#9E9E9E",       // Gray
    "admiration": "#4CAF50",    // Green
    "amusement": "#FF9800",     // Orange
    "curiosity": "#00BCD4",     // Cyan
    "relief": "#8BC34A",        // Light Green
    "optimism": "#FFEB3B",      // Yellow
    "default": "#607D8B"        // Slate Gray
};

const ChatAnalytics = () => {
    interface Analytics {
        labelCounts: Record<string, number>;
        activeHours: Record<string, number>;
        totalChats: number;
        emotions: Record<string, number>;
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
                    setAnalytics({ 
                        labelCounts: {}, 
                        activeHours: {}, 
                        totalChats: 0, 
                        emotions: {} 
                    });
                } else {
                    setAnalytics(response.data);
                }
            } catch (error) {
                console.error("API Fetch Error:", error);
                setAnalytics({ 
                    labelCounts: {}, 
                    activeHours: {}, 
                    totalChats: 0, 
                    emotions: {} 
                });
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

    // Prepare data for visualizations
    const labelData = Object.entries(analytics.labelCounts).map(([label, count], index) => ({
        name: label,
        value: count,
    }));

    const activeHoursData = Object.entries(analytics.activeHours).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count: count,
    }));

    const emotionData = Object.entries(analytics.emotions || {}).map(([emotion, count]) => ({
        name: emotion,
        value: count,
        color: EMOTION_COLORS[emotion.toLowerCase()] || EMOTION_COLORS.default
    }));

    // Emotion Intensity Computation
    const totalEmotions = emotionData.reduce((sum, emotion) => sum + emotion.value, 0);
    const emotionIntensity = emotionData.map(emotion => ({
        ...emotion,
        percentage: ((emotion.value / totalEmotions) * 100).toFixed(2)
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="p-6 space-y-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-center">Chat Analytics</h1>

            <Card>
                <CardContent className="p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-semibold">Total Chats: {analytics.totalChats}</div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Message Category Distribution */}
                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Message Category Distribution</h2>
                        <PieChart width={350} height={350}>
                            <Pie 
                                data={labelData} 
                                dataKey="value" 
                                nameKey="name" 
                                outerRadius={130} 
                                innerRadius={60} 
                                paddingAngle={5}
                            >
                                {labelData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={`hsl(${index * 60}, 70%, 50%)`} 
                                        stroke="white" 
                                        strokeWidth={2} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} 
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                layout="horizontal" 
                                align="center" 
                            />
                        </PieChart>
                    </CardContent>
                </Card>

                {/* Chat Activity by Hour */}
                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Chat Activity by Hour</h2>
                        <BarChart 
                            width={450} 
                            height={320} 
                            data={activeHoursData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                            <XAxis dataKey="hour" tick={{ fill: "white" }} />
                            <YAxis tick={{ fill: "white" }} />
                            <Tooltip 
                                wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} 
                            />
                            <Bar 
                                dataKey="count" 
                                fill="#8884d8" 
                                barSize={40} 
                                radius={[10, 10, 0, 0]} 
                            />
                        </BarChart>
                    </CardContent>
                </Card>
            </div>

            {/* Emotion Analysis */}
            {emotionData.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-center">Emotional Landscape</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Emotion Distribution Pie Chart */}
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-center">Emotion Distribution</h3>
                                <PieChart width={350} height={350}>
                                    <Pie 
                                        data={emotionData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        outerRadius={130} 
                                        innerRadius={60} 
                                        paddingAngle={5}
                                    >
                                        {emotionData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.color} 
                                                stroke="white" 
                                                strokeWidth={2} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        wrapperStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }} 
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        layout="horizontal" 
                                        align="center" 
                                    />
                                </PieChart>
                            </div>

                            {/* Emotion Intensity Table */}
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-center">Emotion Intensity</h3>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800">
                                            <th className="p-2">Emotion</th>
                                            <th className="p-2">Count</th>
                                            <th className="p-2">Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {emotionIntensity.map((emotion, index) => (
                                            <tr 
                                                key={emotion.name} 
                                                className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}`}
                                            >
                                                <td className="p-2">{emotion.name}</td>
                                                <td className="p-2">{emotion.value}</td>
                                                <td className="p-2">{emotion.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ChatAnalytics;