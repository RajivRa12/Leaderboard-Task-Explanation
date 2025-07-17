import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Trophy } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                404
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Oops! This page doesn't exist
              </p>
              <p className="text-gray-500 mb-6">
                The page you're looking for might have been moved or deleted.
              </p>
            </div>

            <Link to="/">
              <Button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Leaderboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
