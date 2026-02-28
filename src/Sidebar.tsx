import { useRef, useState } from "react";
import {
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ThreeStarAiIcon from "@/assets/three-star-ai.svg?react";
import TwoStarAiIcon from "@/assets/two-star-ai.svg?react";
import PreviousIcon from "@/assets/previous.svg?react";
import NextIcon from "@/assets/next.svg?react";
import PersonImage from "@/assets/person.png";

import CourtImage from "@/assets/court.png";
import OutsideImage from "@/assets/outside.png";
import StairsImage from "@/assets/stairs.png";
import RoomImage from "@/assets/room.png";

import { cn } from "@/lib/utils";

import XIcon from "@/components/icons/xIcon";

interface BackgroundIdea {
  id: number;
  image: string;
}

const MOCK_BACK_IDEAS: BackgroundIdea[] = [
  { id: 1, image: CourtImage },
  { id: 2, image: OutsideImage },
  { id: 3, image: StairsImage },
  { id: 4, image: RoomImage },
];

type Nullable<T> = T | null;

// ideally best to move to separate file but for simplicity keeping in the same file
const BackgroundCard: React.FC<{
  idea: BackgroundIdea;
  isActive: boolean;
  onClick: (idea: BackgroundIdea) => void;
}> = ({ idea, isActive, onClick }) => (
  <Card
    className={cn(
      "p-0 relative rounded-2xl overflow-hidden cursor-pointer",
      isActive ? "border-2 border-black" : "",
    )}
    onClick={() => onClick(idea)}
  >
    <img
      src={idea.image}
      alt={`Background ${idea.id}`}
      className="w-auto h-49.5 object-fill"
    />
    <img
      src={PersonImage}
      className="w-auto h-49.5 object-fill absolute top-0"
    />
    {idea.id === 1 && (
      <Badge className="absolute top-1.5 left-1.5 bg-white text-black rounded-[5px] py-1 px-1.5 text-[10px] font-bold">
        DEFAULT
      </Badge>
    )}
  </Card>
);

// ideally best to move to separate file but for simplicity keeping in the same file
const ProgressCard: React.FC<{ progress: number }> = ({ progress }) => (
  <Card className="p-0 relative bg-black rounded-2xl overflow-hidden flex items-center justify-center px-2">
    <span className="font-medium text-sm text-white">{progress}%</span>
    <Progress value={progress} />
  </Card>
);

const SideBar = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [backgroundIdeas, setBackgroundIdeas] =
    useState<BackgroundIdea[]>(MOCK_BACK_IDEAS);
  const [currentPromptBackgroundIdeas, setCurrentPromptBackgroundIdeas] =
    useState<BackgroundIdea[]>([]);
  const [currentPromptActiveIdeaIndex, setCurrentPromptActiveIdeaIndex] =
    useState<Nullable<number>>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [activeBackground, setActiveBackground] =
    useState<Nullable<number>>(null);

  const intervalRef = useRef<number | undefined>(undefined);

  const { setOpen } = useSidebar();

  const handleChangeActiveGeneration = (change: number) => {
    setCurrentPromptActiveIdeaIndex((prev) => {
      if (prev === null) return 0;
      const newValue = prev + change;
      if (newValue < 0 || newValue >= currentPromptBackgroundIdeas.length) {
        return prev;
      }
      setActiveBackground(currentPromptBackgroundIdeas[newValue]?.id ?? null);
      return newValue;
    });
  };

  const handleCardClick = (background: BackgroundIdea) => {
    setActiveBackground(background.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCurrentPromptActiveIdeaIndex(null);
    setCurrentPromptBackgroundIdeas([]);
  };

  const handleAddBackground = (image: string, regenerated?: boolean) => {
    // can be improved with introduction of uuid but for simplicity just using max id + 1
    const maxId =
      backgroundIdeas.length > 0
        ? Math.max(...backgroundIdeas.map((b) => b.id))
        : 0;
    const newIdea = { id: maxId + 1, image };
    setBackgroundIdeas([newIdea, ...backgroundIdeas]);
    const currPromptsIdeas = regenerated
      ? [...currentPromptBackgroundIdeas, newIdea]
      : [newIdea];
    setCurrentPromptBackgroundIdeas(currPromptsIdeas);
    setCurrentPromptActiveIdeaIndex(currPromptsIdeas.length - 1);
    setActiveBackground(newIdea.id);
  };

  const handleGenerate = (regenerate?: boolean) => {
    setIsGenerating(true);
    intervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          setIsGenerating(false);
          handleAddBackground(PersonImage, regenerate);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = undefined;

          return 0;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <>
      <SidebarTrigger className="cursor-pointer" />
      <span className="h-6.25"> {`<- open sidebar`}</span>
      <Sidebar
        side="right"
        collapsible="offcanvas"
        className="pl-5.25 pr-2 pt-8"
      >
        <SidebarHeader className="p-0 pr-3.25">
          <SidebarMenu className="flex-row justify-between">
            <SidebarMenuItem className="text-[22px]/[1.2] font-bold">
              Change background
            </SidebarMenuItem>
            <SidebarMenuItem onClick={() => setOpen(false)} className="cursor-pointer" >
              <XIcon size={24} padding={0} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="pb-4 pr-3.25 overflow-auto">
          <SidebarGroup className="p-0 pt-5.25 mb-8">
            <SidebarGroupLabel className="p-0 pb-2.75 text-[14px]/[120%] font-semibold text-black h-auto">
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent className="w-full max-w-xl border border-gray-300 rounded-md bg-background flex flex-col h-50">
              <Textarea
                value={content}
                onChange={handleChange}
                placeholder="Type your idea for a background..."
                rows={5}
                className="flex-1 resize-none border-0 focus-visible:ring-0 overflow-y-auto text-[14px]/[140%]"
              />
              <div className="h-8.5 flex items-center justify-between mx-4 mb-1 bg-white">
                <Button
                  variant="ghost"
                  className="text-[12px]/[120%] font-semibold cursor-pointer"
                  disabled={
                    isGenerating || !currentPromptBackgroundIdeas.length
                  }
                  onClick={() => handleGenerate(true)}
                >
                  <TwoStarAiIcon />
                  Regenerate
                </Button>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    disabled={
                      isGenerating ||
                      currentPromptActiveIdeaIndex === null ||
                      currentPromptActiveIdeaIndex === 0
                    }
                    onClick={() => handleChangeActiveGeneration(-1)}
                  >
                    <PreviousIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 cursor-pointer"
                    disabled={
                      isGenerating ||
                      currentPromptActiveIdeaIndex === null ||
                      currentPromptActiveIdeaIndex ===
                        currentPromptBackgroundIdeas.length - 1
                    }
                    onClick={() => handleChangeActiveGeneration(1)}
                  >
                    <NextIcon />
                  </Button>
                </div>
              </div>
            </SidebarGroupContent>
            <SidebarGroupContent className="mt-6.25">
              <Button
                onClick={() => handleGenerate()}
                className="rounded-full w-full h-12 cursor-pointer"
                size="lg"
                disabled={isGenerating}
              >
                <ThreeStarAiIcon />
                Generate BG for 1 credit
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="p-0 text-[14px]/[120%] font-semibold text-black mb-2.75">
              Your backgrounds
            </SidebarGroupLabel>
            <SidebarGroupContent className="grid grid-cols-3 gap-2.75">
              {isGenerating && <ProgressCard progress={loadingProgress} />}
              {backgroundIdeas.map((idea) => (
                <BackgroundCard
                  key={idea.id}
                  idea={idea}
                  isActive={idea.id === activeBackground}
                  onClick={handleCardClick}
                />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default SideBar;
