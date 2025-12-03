"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TreePine, Music } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type ProgressStage = 
  | "idle"
  | "analyzing"
  | "finding"
  | "creating"
  | "complete";

interface PlaylistGeneratorProps {
  onGenerate?: () => void | Promise<void>;
  isLoading?: boolean;
  progressStage?: ProgressStage;
}

/**
 * PlaylistGenerator - Component for generating festive playlists
 * Shows loading states and progress indicators
 */
export function PlaylistGenerator({ 
  onGenerate, 
  isLoading = false,
  progressStage = "idle"
}: PlaylistGeneratorProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleGenerate = async () => {
    setInternalLoading(true);
    try {
      await onGenerate?.();
    } finally {
      setInternalLoading(false);
    }
  };

  const isGenerating = isLoading || internalLoading;
  const currentStage = progressStage !== "idle" ? progressStage : (isGenerating ? "analyzing" : "idle");

  const getProgressValue = () => {
    switch (currentStage) {
      case "analyzing":
        return 33;
      case "finding":
        return 66;
      case "creating":
        return 90;
      case "complete":
        return 100;
      default:
        return 0;
    }
  };

  const getStageText = () => {
    switch (currentStage) {
      case "analyzing":
        return "Analysing your taste...";
      case "finding":
        return "Finding festive matches...";
      case "creating":
        return "Creating playlist...";
      case "complete":
        return "Playlist ready!";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
        <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Generate Button */}
          {!isGenerating && (
            <Button
              onClick={handleGenerate}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Generate My Festive Playlist
            </Button>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="w-full space-y-6">
              {/* Animated Christmas Tree/Ornament */}
              <div className="flex justify-center">
                <div className="relative">
                  <TreePine className="w-16 h-16 text-primary animate-spin-slow" />
                  <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {getStageText()}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {getProgressValue()}%
                  </span>
                </div>
                <Progress 
                  value={getProgressValue()} 
                  className="h-3"
                />
              </div>

              {/* Stage Indicators */}
              <div className="flex justify-center gap-4 pt-2">
                <StageIndicator 
                  stage="analyzing" 
                  currentStage={currentStage}
                  icon={<Music className="w-4 h-4" />}
                />
                <StageIndicator 
                  stage="finding" 
                  currentStage={currentStage}
                  icon={<Sparkles className="w-4 h-4" />}
                />
                <StageIndicator 
                  stage="creating" 
                  currentStage={currentStage}
                  icon={<TreePine className="w-4 h-4" />}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

interface StageIndicatorProps {
  stage: ProgressStage;
  currentStage: ProgressStage;
  icon: React.ReactNode;
}

function StageIndicator({ stage, currentStage, icon }: StageIndicatorProps) {
  const stages: ProgressStage[] = ["analyzing", "finding", "creating"];
  const currentIndex = stages.indexOf(currentStage);
  const stageIndex = stages.indexOf(stage);
  
  const isActive = stageIndex <= currentIndex;
  const isCurrent = stage === currentStage;

  return (
    <div
      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
        isActive ? "opacity-100" : "opacity-30"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isCurrent
            ? "bg-primary text-primary-foreground scale-110"
            : isActive
            ? "bg-primary/50 text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-xs font-medium ${
          isCurrent ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {stage === "analyzing" && "Analyse"}
        {stage === "finding" && "Match"}
        {stage === "creating" && "Create"}
      </span>
    </div>
  );
}

