import {
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  UserPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/app-header";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/stores/use-modal-store";

function LandingPage() {
  const navigate = useNavigate();
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  return (
    <div>
      <AppHeader>
        <span className="font-semibold">Start Chatting ⚡</span>
      </AppHeader>
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-background via-background to-muted/20  p-2">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Main Illustration */}
          <div className="relative">
            <div className="relative mx-auto w-32 h-32 mb-6">
              {/* Chat bubble illustration */}
              <div
                className={cn(
                  "absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20 transform rotate-12 animate-pulse",
                  "shadow-lg backdrop-blur-sm"
                )}
              />
              <div
                className={cn(
                  "absolute inset-2 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center transform -rotate-6",
                  "shadow-xl"
                )}
              >
                <img
                  src="/chatify.svg"
                  className="size-14 text-primary-foreground"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-bounce delay-100" />
              <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300" />
              <div className="absolute top-1/2 -right-4 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-500" />
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome to Chatify
              </h1>
              <p className="text-xl text-muted-foreground">
                Your conversations start here
              </p>
            </div>

            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Select a conversation from the sidebar to continue chatting,
              create a group chat with multiple friends, or browse your friends
              list to connect with others.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Card
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => navigate("/friends")}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UserPlusIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Browse Friends</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with your friends and contacts
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:bg-primary/10"
                >
                  View Friends
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            <Card
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => setActiveModal("create:group:chat", null)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Create Group Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation with multiple friends
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:bg-primary/10"
                >
                  Create Group
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-6">
            <h2 className="text-lg font-semibold text-muted-foreground">
              What you can do
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Real-time Chat
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Group Conversations
              </Badge>
            </div>
          </div>

          {/* Subtle animation background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-ping"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/30 rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full animate-ping"
              style={{ animationDelay: "4s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
