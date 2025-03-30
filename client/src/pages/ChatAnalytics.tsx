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
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/Card";
import axios from "axios";

// Enhanced emotion color palette with more meaningful colors
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

// Emotion groups for better visualization
const EMOTION_GROUPS = {
    "Positive": ["joy", "love", "admiration", "amusement", "relief", "optimism"],
    "Negative": ["anger", "sadness", "fear", "disgust"],
    "Activation": ["excitement", "surprise", "curiosity"],
    "Neutral": ["neutral"]
};

// Emotion icons (using simple text representations)
const EMOTION_ICONS: Record<string, string> = {
    "joy": "😊", 
    "excitement": "🤩",
    "love": "❤️",
    "surprise": "😲",
    "anger": "😠",
    "sadness": "😢",
    "fear": "😨",
    "disgust": "🤢",
    "neutral": "😐",
    "admiration": "🥰",
    "amusement": "😄",
    "curiosity": "🧐",
    "relief": "😌",
    "optimism": "😃",
    "default": "🔍"
};

const ChatAnalytics = () => {
    interface Analytics {
        labelCounts: Record<string, number>;
        activeHours: Record<string, number>;
        totalChats: number;
        emotions: Array<{ mood: string, timestamp?: string }> | Record<string, number>;
    }

    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [emotionView, setEmotionView] = useState<"pie" | "radar" | "trend">("pie");
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
                        emotions: [] 
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
                    emotions: [] 
                });
            }
        };
        
        fetchAnalytics();
    }, [userId, chatCategoryId]);

    if (!analytics) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="animate-pulse text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
                <p className="mt-4 text-xl text-blue-300">Analyzing your emotional landscape...</p>
            </div>
        </div>
    );

    if (analytics.totalChats === 0) {
        return (
            <div className="p-6 text-center bg-gray-900 h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-white mb-6">Mood Analytics</h1>
                <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md">
                    <div className="text-8xl mb-4">🔍</div>
                    <p className="text-xl text-gray-300">No emotional data found for this category.</p>
                    <p className="mt-4 text-gray-400">Start conversations to begin tracking your emotional patterns.</p>
                </div>
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

    // Process emotions data based on its structure
    let emotionData: Array<{name: string, value: number, color: string, icon: string}> = [];
    let emotionTimeline: Array<{date: string, emotions: Record<string, number>}> = [];
    
    if (analytics.emotions) {
        // Check if emotions is an array of objects with mood property
        if (Array.isArray(analytics.emotions)) {
            // Count occurrences of each mood
            const moodCounts: Record<string, number> = {};
            
            // For timeline analysis
            const timelineData: Record<string, Record<string, number>> = {};
            
            analytics.emotions.forEach(item => {
                if (item && item.mood) {
                    const mood = item.mood;
                    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
                    
                    // Process timeline data if timestamp exists
                    if (item.timestamp) {
                        const date = new Date(item.timestamp).toLocaleDateString();
                        if (!timelineData[date]) {
                            timelineData[date] = {};
                        }
                        timelineData[date][mood] = (timelineData[date][mood] || 0) + 1;
                    }
                }
            });
            
            emotionData = Object.entries(moodCounts).map(([mood, count]) => ({
                name: mood,
                value: count,
                color: EMOTION_COLORS[mood.toLowerCase()] || EMOTION_COLORS.default,
                icon: EMOTION_ICONS[mood.toLowerCase()] || EMOTION_ICONS.default
            }));
            
            // Convert timeline data to array format
            emotionTimeline = Object.entries(timelineData).map(([date, emotions]) => ({
                date,
                emotions
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } 
        // If emotions is already in the expected format (Record<string, number>)
        else if (typeof analytics.emotions === 'object') {
            emotionData = Object.entries(analytics.emotions).map(([emotion, count]) => ({
                name: emotion,
                value: count,
                color: EMOTION_COLORS[emotion.toLowerCase()] || EMOTION_COLORS.default,
                icon: EMOTION_ICONS[emotion.toLowerCase()] || EMOTION_ICONS.default
            }));
        }
    }

    // Calculate emotion intensity
    const totalEmotions = emotionData.reduce((sum, emotion) => sum + emotion.value, 0);
    const emotionIntensity = emotionData.length > 0 
        ? emotionData.map(emotion => ({
            ...emotion,
            percentage: ((emotion.value / totalEmotions) * 100).toFixed(2)
          })).sort((a, b) => b.value - a.value)
        : [];
          
    // Group emotions by category for radar chart
    const prepareRadarData = () => {
        const groupedData: Record<string, number> = {};
        
        Object.entries(EMOTION_GROUPS).forEach(([group, emotions]) => {
            const groupTotal = emotionData
                .filter(emotion => emotions.includes(emotion.name.toLowerCase()))
                .reduce((sum, emotion) => sum + emotion.value, 0);
            
            groupedData[group] = groupTotal;
        });
        
        return Object.entries(groupedData).map(([group, value]) => ({
            subject: group,
            A: value,
            fullMark: totalEmotions
        }));
    };
    
    // Prepare emotion trend data (across time)
    const prepareTrendData = () => {
        if (emotionTimeline.length === 0) return [];
        
        // Get all unique emotions
        const allEmotions = new Set<string>();
        emotionTimeline.forEach(day => {
            Object.keys(day.emotions).forEach(emotion => {
                allEmotions.add(emotion);
            });
        });
        
        // Create trend data with all emotions
        return emotionTimeline.map(day => {
            const dayData: Record<string, any> = { date: day.date };
            allEmotions.forEach(emotion => {
                dayData[emotion] = day.emotions[emotion] || 0;
            });
            return dayData;
        });
    };
    
    const radarData = prepareRadarData();
    const trendData = prepareTrendData();
    
    // Calculate dominant emotion
    const dominantEmotion = emotionIntensity.length > 0 ? emotionIntensity[0] : null;
    
    // Calculate emotion balance (positive vs negative ratio)
    const calculateEmotionBalance = () => {
        // Add debug logging to understand what emotions are being processed
        console.log("Emotion data for balance calculation:", emotionData);
        console.log("Positive emotions defined:", EMOTION_GROUPS.Positive);
        console.log("Negative emotions defined:", EMOTION_GROUPS.Negative);
        
        // Force lowercase comparison throughout to ensure matching
        const positive = emotionData
            .filter(e => EMOTION_GROUPS.Positive.includes(e.name.toLowerCase()))
            .reduce((sum, e) => sum + e.value, 0);
            
        const negative = emotionData
            .filter(e => EMOTION_GROUPS.Negative.includes(e.name.toLowerCase()))
            .reduce((sum, e) => sum + e.value, 0);
        
        console.log("Calculated positive emotions total:", positive);
        console.log("Calculated negative emotions total:", negative);
            
        const total = positive + negative;
        
        // Default to 50% if we don't have any emotions that match our groups
        if (total === 0) {
            console.log("No matching emotions found, defaulting to 50%");
            return 50; 
        }
        
        const balanceValue = Math.round((positive / total) * 100);
        console.log("Calculated balance value:", balanceValue);
        return balanceValue;
    };
    
    const emotionBalance = calculateEmotionBalance();

    return (
        <div className="p-6 space-y-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Emotional Landscape</h1>

            {/* Mood Summary Card */}
            <Card>
                <CardContent className="p-6 bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                            <div className="text-lg text-gray-300">Total Interactions</div>
                            <div className="text-3xl font-bold">{analytics.totalChats}</div>
                        </div>
                        
                        {dominantEmotion && (
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                                <div className="text-lg text-gray-300">Dominant Mood</div>
                                <div className="flex items-center mt-2">
                                    <span className="text-3xl mr-2">{dominantEmotion.icon}</span>
                                    <span className="text-2xl font-bold" style={{ color: dominantEmotion.color }}>
                                        {dominantEmotion.name}
                                    </span>
                                </div>
                            </div>
                        )}
                       
                    </div>
                </CardContent>
            </Card>

            {/* Emotion Visualization Controls */}
            {emotionData.length > 0 && (
                <div className="flex justify-center space-x-4 my-6">
                    <button 
                        onClick={() => setEmotionView("pie")} 
                        className={`px-4 py-2 rounded-full transition ${emotionView === 'pie' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Emotion Distribution
                    </button>
                    <button 
                        onClick={() => setEmotionView("radar")} 
                        className={`px-4 py-2 rounded-full transition ${emotionView === 'radar' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Emotion Categories
                    </button>
                    {trendData.length > 0 && (
                        <button 
                            onClick={() => setEmotionView("trend")} 
                            className={`px-4 py-2 rounded-full transition ${emotionView === 'trend' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Emotion Trends
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emotion Analysis - Only render if we have emotion data */}
                {emotionData.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                {emotionView === "pie" ? "Emotion Distribution" : 
                                 emotionView === "radar" ? "Emotion Categories" : "Emotion Trends"}
                            </h2>
                            
                            {/* Pie Chart View */}
                            {emotionView === "pie" && (
                                <div className="flex flex-col items-center">
                                    <PieChart width={350} height={350}>
                                        <Pie 
                                            data={emotionData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            outerRadius={130} 
                                            innerRadius={60} 
                                            paddingAngle={5}
                                            onMouseEnter={(_, index) => setSelectedEmotion(emotionData[index].name)}
                                            onMouseLeave={() => setSelectedEmotion(null)}
                                        >
                                            {emotionData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    stroke="white" 
                                                    strokeWidth={selectedEmotion === entry.name ? 3 : 1} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                                                            <p className="text-lg flex items-center">
                                                                <span className="mr-2">{data.icon}</span>
                                                                <span className="font-bold" style={{ color: data.color }}>{data.name}</span>
                                                            </p>
                                                            <p className="text-gray-300">Count: {data.value}</p>
                                                            <p className="text-gray-300">
                                                                {((data.value / totalEmotions) * 100).toFixed(1)}% of total
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </div>
                            )}
                            
                            {/* Radar Chart View */}
                            {emotionView === "radar" && (
                                <div className="flex flex-col items-center">
                                    <RadarChart outerRadius={130} width={350} height={350} data={radarData}>
                                        <PolarGrid gridType="polygon" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: "white" }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                                        <Radar name="Emotions" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    const percentage = ((data.A / totalEmotions) * 100).toFixed(1);
                                                    return (
                                                        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                                                            <p className="text-lg font-bold text-purple-400">{data.subject}</p>
                                                            <p className="text-gray-300">Count: {data.A}</p>
                                                            <p className="text-gray-300">{percentage}% of total</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </RadarChart>
                                </div>
                            )}
                            
                            {/* Trend Chart View */}
                            {emotionView === "trend" && trendData.length > 0 && (
                                <div className="flex flex-col items-center h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                            <XAxis dataKey="date" tick={{ fill: "white" }} />
                                            <YAxis tick={{ fill: "white" }} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: "rgba(30, 30, 30, 0.9)", color: "white", border: "none" }}
                                            />
                                            <Legend />
                                            {Array.from(new Set(trendData.flatMap(d => Object.keys(d).filter(k => k !== "date")))).map((emotion, index) => (
                                                <Line 
                                                    type="monotone" 
                                                    key={emotion} 
                                                    dataKey={emotion} 
                                                    stroke={EMOTION_COLORS[emotion.toLowerCase()] || `hsl(${index * 30}, 70%, 50%)`} 
                                                    strokeWidth={2}
                                                    activeDot={{ r: 8 }} 
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Emotion Intensity with Enhanced UI */}
                {emotionData.length > 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4 text-center">Emotional Intensity</h2>
                            <div className="space-y-4">
                                {emotionIntensity.slice(0, 5).map((emotion) => (
                                    <div key={emotion.name} className="p-3 rounded-lg bg-gray-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-2">{emotion.icon}</span>
                                                <span className="font-bold text-lg" style={{ color: emotion.color }}>
                                                    {emotion.name}
                                                </span>
                                            </div>
                                            <span className="font-medium">{emotion.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full"
                                                style={{ 
                                                    width: `${emotion.percentage}%`,
                                                    backgroundColor: emotion.color 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                                
                                {emotionIntensity.length > 5 && (
                                    <div className="mt-4 text-center">
                                        <p className="text-gray-400">+ {emotionIntensity.length - 5} more emotions</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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

                {/* Chat Activity by Hour with enhanced visualization */}
                <Card>
                    <CardContent className="p-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Chat Activity Pattern</h2>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart 
                                data={activeHoursData} 
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis dataKey="hour" tick={{ fill: "white" }} />
                                <YAxis tick={{ fill: "white" }} />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            // Determine if this is morning, afternoon, evening, or night
                                            const hour = parseInt(label.split(':')[0]);
                                            let timeOfDay = "Morning";
                                            let icon = "🌅";
                                            
                                            if (hour >= 12 && hour < 17) {
                                                timeOfDay = "Afternoon";
                                                icon = "☀️";
                                            } else if (hour >= 17 && hour < 21) {
                                                timeOfDay = "Evening";
                                                icon = "🌆";
                                            } else if (hour >= 21 || hour < 6) {
                                                timeOfDay = "Night";
                                                icon = "🌙";
                                            }
                                            
                                            return (
                                                <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                                                    <p className="text-lg flex items-center">
                                                        <span className="mr-2">{icon}</span>
                                                        <span className="font-bold text-blue-300">{timeOfDay} - {label}</span>
                                                    </p>
                                                    <p className="text-gray-300">Chats: {payload[0].value}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    radius={[10, 10, 0, 0]}
                                    barSize={40}
                                >
                                    {activeHoursData.map((entry, index) => {
                                        const hour = parseInt(entry.hour.split(':')[0]);
                                        let color = "#4299E1"; // Morning (default)
                                        
                                        if (hour >= 12 && hour < 17) {
                                            color = "#F6AD55"; // Afternoon
                                        } else if (hour >= 17 && hour < 21) {
                                            color = "#F687B3"; // Evening
                                        } else if (hour >= 21 || hour < 6) {
                                            color = "#805AD5"; // Night
                                        }
                                        
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            {/* Insights Card - AI-generated insights based on data */}
            <Card>
                <CardContent className="p-6 bg-gradient-to-br from-gray-800 to-gray-900">
                    <h2 className="text-2xl font-bold mb-4 text-center">Mood Insights</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                                <h3 className="font-bold text-blue-400 flex items-center">
                                    <span className="mr-2">🔍</span> Peak Activity Time
                                </h3>
                                <p className="text-gray-300 mt-2">
                                    {activeHoursData.length > 0 ? (
                                        `Your conversations are most active at ${
                                            activeHoursData.sort((a, b) => b.count - a.count)[0].hour
                                        }`
                                    ) : (
                                        "Not enough data to determine peak activity time"
                                    )}
                                </p>
                            </div>
                            
                            {dominantEmotion && (
                                <div className="bg-gray-800 p-4 rounded-lg border-l-4" style={{ borderColor: dominantEmotion.color }}>
                                    <h3 className="font-bold flex items-center" style={{ color: dominantEmotion.color }}>
                                        <span className="mr-2">{dominantEmotion.icon}</span> Dominant Emotion
                                    </h3>
                                    <p className="text-gray-300 mt-2">
                                        {`${dominantEmotion.name} represents ${dominantEmotion.percentage}% of your emotional responses`}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Right Column */}
                        <div className="space-y-4">
                            {emotionBalance !== 50 && (
                                <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
                                    <h3 className="font-bold text-purple-400 flex items-center">
                                        <span className="mr-2">⚖️</span> Emotional Balance
                                    </h3>
                                    <p className="text-gray-300 mt-2">
                                        {emotionBalance > 60 
                                            ? "Your conversations tend to be quite positive!" 
                                            : emotionBalance < 40 
                                                ? "Your conversations show more negative emotions than positive ones."
                                                : "Your conversations have a balanced mix of positive and negative emotions."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatAnalytics;