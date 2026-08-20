import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileText, Copy, Share2, Download, X, Eye, Code2, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { RealisticEditor } from "./RealisticEditor";
import { useState } from "react";
import { DiscreteTabs } from "./uselayouts/discrete-tabs";

export function ArtifactEditor({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState("preview");

  const tabs = [
    { id: "preview", title: "Preview", icon: Eye },
    { id: "editor", title: "Calculator.java", icon: Code2 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] dark:bg-zinc-950 animate-in fade-in duration-300">
      <Tabs value={activeTab} className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 bg-[#f9f9f9]/90 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-transparent dark:border-zinc-800 z-10">
          <div className="flex-1 min-w-0">
            <DiscreteTabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
          
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 flex-shrink-0 ml-2">
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="View Source">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Copy className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
            </button>
            {onClose && (
              <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="preview" className="h-full w-full p-10 overflow-auto bg-[#fdfdfd] dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200">
            <div className="max-w-3xl mx-auto pb-10">
              <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 tracking-tight">Persona Deep Dive: Casual Gamers</h1>
              <p className="mb-8 text-zinc-600 dark:text-zinc-300 leading-[1.8] text-[15px]">
                This document outlines the core motivations, pain points, and behavioral patterns of the "Casual Gamer" segment. Understanding this persona is crucial for designing intuitive onboarding flows and retention strategies.
              </p>
              
              <h2 className="text-xl font-semibold mt-10 mb-5 text-zinc-900 dark:text-zinc-100 tracking-tight">Key Motivations</h2>
              <ul className="list-disc pl-6 mb-10 text-zinc-600 dark:text-zinc-300 space-y-3.5 leading-[1.8] text-[15px]">
                <li><strong className="text-zinc-900 dark:text-zinc-100 font-medium">Modularity:</strong> Allows users to easily rearrange widgets based on their workflow priorities.</li>
                <li><strong className="text-zinc-900 dark:text-zinc-100 font-medium">Information Density:</strong> Maximizes the use of screen real estate without feeling cluttered.</li>
                <li><strong className="text-zinc-900 dark:text-zinc-100 font-medium">Responsive Design:</strong> Adapts fluidly to different screen sizes, ensuring a consistent experience on desktop and tablet.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-10 mb-5 text-zinc-900 dark:text-zinc-100 tracking-tight">4. Primary Journey: Friction Servicing</h2>
              <p className="text-zinc-600 dark:text-zinc-300 text-[15px] leading-[1.8] mb-10">
                <strong className="text-zinc-900 dark:text-zinc-100 font-medium">The Scenario:</strong> John bought a $500 TV during a weekend multiplier campaign, but the points never appeared in his app. He is
                frustrated and calls customer service. The Customer Exec, Sarah, picks up the phone. Her goal is to calm John down, find his
                transaction, explain what went wrong, and credit the missing points as fast as possible without breaching data privacy
                protocols.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="editor" className="h-full w-full p-0 m-0 overflow-auto bg-[#fcfcfc] dark:bg-zinc-950">
            <RealisticEditor 
              initialCode={`import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double num1, num2, result = 0;
        char operator;

        // Taking User Input
        System.out.print("Enter First Number: ");
        num1 = scanner.nextDouble();
        
        System.out.print("Enter Operator (+, -, *, /): ");
        operator = scanner.next().charAt(0);
        
        System.out.print("Enter Second Number: ");
        num2 = scanner.nextDouble();
        
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if(num2 != 0) {
                    result = num1 / num2;
                } else {
                    System.out.println("Error: Division by zero");
                    return;
                }
                break;
            default:
                System.out.println("Error: Invalid operator");
                return;
        }
        
        System.out.println("Result: " + result);
        scanner.close();
    }
}`} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
