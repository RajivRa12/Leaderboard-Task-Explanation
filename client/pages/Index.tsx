import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Confetti } from "@/components/ui/confetti";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { PulseRing } from "@/components/ui/pulse-ring";
import {
  Trophy,
  Star,
  Plus,
  Clock,
  Users,
  Zap,
  Crown,
  Medal,
  Award,
  Sparkles,
} from "lucide-react";
import {
  User,
  ClaimHistory,
  ClaimPointsRequest,
  ClaimPointsResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetUsersResponse,
  GetHistoryResponse,
} from "@shared/api";

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newUserName, setNewUserName] = useState("");
  const [history, setHistory] = useState<ClaimHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [lastClaim, setLastClaim] = useState<ClaimPointsResponse | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebratingUser, setCelebratingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data: GetUsersResponse = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      const data: GetHistoryResponse = await response.json();
      setHistory(data.history);
    } catch (error) {
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, []);

  const handleClaimPoints = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user first");
      return;
    }

    setLoading(true);
    setCelebratingUser(selectedUserId);

    try {
      const request: ClaimPointsRequest = { userId: selectedUserId };
      const response = await fetch("/api/claim-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to claim points");
      }

      const data: ClaimPointsResponse = await response.json();
      setLastClaim(data);

      // Show confetti for good claims
      if (data.pointsAwarded >= 7) {
        setShowConfetti(true);
      }

      // Refresh data
      await Promise.all([fetchUsers(), fetchHistory()]);

      toast.success(data.message, {
        description: `🎉 +${data.pointsAwarded} points awarded!`,
      });
    } catch (error) {
      toast.error("Failed to claim points");
    } finally {
      setLoading(false);
      setTimeout(() => setCelebratingUser(null), 2000);
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      toast.error("Please enter a user name");
      return;
    }

    setAddingUser(true);
    try {
      const request: CreateUserRequest = { name: newUserName.trim() };
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add user");
      }

      const data: CreateUserResponse = await response.json();
      setNewUserName("");
      await fetchUsers();

      toast.success(data.message, {
        description: "Welcome to the leaderboard! 🎮",
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingUser(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-400/50";
      case 2:
        return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/50";
      case 3:
        return "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-100 shadow-lg shadow-amber-600/50";
      default:
        return "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900 shadow-md";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5" />;
      case 2:
        return <Medal className="h-5 w-5" />;
      case 3:
        return <Award className="h-5 w-5" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      <FloatingParticles />
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <motion.div
        className="container mx-auto px-4 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="inline-block"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-6xl mb-4">🏆</h1>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Ultimate Leaderboard
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Claim points, climb the ranks, and become the ultimate champion! ⚡
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div whileHover={cardHoverVariants.hover}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white overflow-hidden relative">
              <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 font-medium">Total Users</p>
                    <motion.p className="text-4xl font-bold">
                      <AnimatedCounter value={users.length} />
                    </motion.p>
                  </div>
                  <PulseRing>
                    <Users className="h-12 w-12 text-blue-200" />
                  </PulseRing>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={cardHoverVariants.hover}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white overflow-hidden relative">
              <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 font-medium">Total Claims</p>
                    <motion.p className="text-4xl font-bold">
                      <AnimatedCounter value={history.length} />
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Zap className="h-12 w-12 text-green-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={cardHoverVariants.hover}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 text-white overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mt-10"
                animate={{
                  x: [0, 10, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 font-medium">Top Score</p>
                    <motion.p className="text-4xl font-bold">
                      <AnimatedCounter
                        value={
                          users.length > 0
                            ? Math.max(...users.map((u) => u.totalPoints))
                            : 0
                        }
                      />
                    </motion.p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                  >
                    <Trophy className="h-12 w-12 text-purple-200" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Controls */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.div whileHover={cardHoverVariants.hover}>
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                    Claim Points
                  </CardTitle>
                  <CardDescription>
                    Select a user and claim random points (1-10) ⚡
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select User
                    </label>
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger className="border-2 border-gray-200 hover:border-blue-400 transition-colors">
                        <SelectValue placeholder="Choose a champion..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                  {user.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {user.name} ({user.totalPoints} pts)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleClaimPoints}
                      disabled={loading || !selectedUserId}
                      className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 hover:from-green-600 hover:via-emerald-700 hover:to-green-800 shadow-lg shadow-green-500/25"
                      size="lg"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex items-center gap-2"
                        >
                          <Sparkles className="h-5 w-5" />
                          Claiming...
                        </motion.div>
                      ) : (
                        <span className="flex items-center gap-2">
                          🎲 Claim Points <Sparkles className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {lastClaim && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg"
                      >
                        <p className="text-green-800 font-medium flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Latest Claim:
                        </p>
                        <p className="text-green-700 text-sm">
                          {lastClaim.user.name} earned{" "}
                          <span className="font-bold text-green-800">
                            {lastClaim.pointsAwarded}
                          </span>{" "}
                          points! 🎉
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={cardHoverVariants.hover}>
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Plus className="h-6 w-6 text-blue-500" />
                    </motion.div>
                    Add New User
                  </CardTitle>
                  <CardDescription>
                    Add a new player to the leaderboard 🎮
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      User Name
                    </label>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Enter username..."
                        onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                        className="border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAddUser}
                      disabled={addingUser || !newUserName.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 hover:from-blue-600 hover:via-indigo-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
                      size="lg"
                    >
                      {addingUser ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-5 w-5" />
                          Adding...
                        </motion.div>
                      ) : (
                        <span className="flex items-center gap-2">
                          ➕ Add User <Sparkles className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Leaderboard */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <motion.div whileHover={cardHoverVariants.hover}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <Trophy className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                    Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Current rankings by total points 🏆
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {users.map((user, index) => (
                        <motion.div
                          key={user.id}
                          layout
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            delay: index * 0.1,
                          }}
                          whileHover={{
                            scale: 1.03,
                            y: -2,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedUserId === user.id
                              ? "ring-4 ring-blue-500/50 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300"
                              : "bg-white/90 hover:bg-white border-gray-200 hover:border-gray-300"
                          } ${celebratingUser === user.id ? "animate-pulse" : ""}`}
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 25,
                                }}
                              >
                                <Badge
                                  className={`${getRankColor(user.rank)} border-0 text-sm px-3 py-1`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    {getRankIcon(user.rank)}#{user.rank}
                                  </span>
                                </Badge>
                              </motion.div>

                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                  }}
                                >
                                  <Avatar className="h-10 w-10 shadow-lg">
                                    <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 text-white">
                                      {user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                </motion.div>
                                <span className="font-semibold text-gray-900 text-lg">
                                  {user.name}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <motion.p className="font-bold text-2xl text-gray-900">
                                <AnimatedCounter value={user.totalPoints} />
                              </motion.p>
                              <p className="text-sm text-gray-500 font-medium">
                                points
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {users.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-500"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        </motion.div>
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          Add some users to get started! 🚀
                        </p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced History */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <motion.div whileHover={cardHoverVariants.hover}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Clock className="h-6 w-6 text-gray-500" />
                    </motion.div>
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest point claims and updates ⚡
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {history.slice(0, 10).map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          whileHover={{
                            scale: 1.02,
                            y: -1,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }}
                          className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                          >
                            <Avatar className="h-10 w-10 shadow-md">
                              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-green-400 to-blue-400 text-white">
                                {item.userName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {item.userName}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </p>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                          >
                            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm">
                              <span className="flex items-center gap-1">
                                +{item.pointsAwarded}
                                <Sparkles className="h-3 w-3" />
                              </span>
                            </Badge>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {history.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-500"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                        >
                          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        </motion.div>
                        <p className="text-lg font-medium">No activity yet</p>
                        <p className="text-sm">Start claiming points! 🎮</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
