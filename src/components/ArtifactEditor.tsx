import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Copy, Share2, Download, X, Eye, Code2 } from "lucide-react";
import { RealisticEditor } from "./RealisticEditor";

export function ArtifactEditor({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] animate-in slide-in-from-right-8 duration-300">
      <Tabs defaultValue="artifact" className="flex flex-col h-full w-full">
        <div className="h-[52px] border-b border-slate-200 flex items-center justify-between pl-0 pr-2 bg-[#f9f9f9]">
          <TabsList className="bg-transparent p-0 h-full flex justify-start items-end mb-0 flex-1 min-w-0">
            <TabsTrigger 
              value="artifact" 
              title="persona-deep-dive.md"
              className="group data-[state=active]:bg-[#fdfdfd] data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-500 border-r border-r-slate-200 rounded-none px-4 py-3 text-[13px] font-medium text-gray-500 data-[state=active]:text-gray-900 transition-none h-full flex items-center justify-between flex-1 min-w-[60px] max-w-[200px] bg-transparent hover:bg-gray-100/50"
            >
              <div className="flex items-center gap-2 overflow-hidden mr-1 min-w-0">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="truncate block text-left">persona-deep-dive.md</span>
              </div>
              <div 
                className="w-5 h-5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClose) onClose();
                }}
              >
                <X className="w-3.5 h-3.5" />
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              title="Calculator.java"
              className="group data-[state=active]:bg-[#fdfdfd] data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-blue-500 border-r border-r-slate-200 rounded-none px-4 py-3 text-[13px] font-medium text-gray-500 data-[state=active]:text-gray-900 transition-none h-full flex items-center justify-between flex-1 min-w-[60px] max-w-[200px] bg-transparent hover:bg-gray-100/50"
            >
              <div className="flex items-center gap-2 overflow-hidden mr-1 min-w-0">
                <Code2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate block text-left">Calculator.java</span>
              </div>
              <div 
                className="w-5 h-5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClose) onClose();
                }}
              >
                <X className="w-3.5 h-3.5" />
              </div>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-1 text-gray-400 flex-shrink-0 ml-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors" title="View Source">
              <FileText className="w-4 h-4" strokeWidth={2} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors" title="Copy">
              <Copy className="w-4 h-4" strokeWidth={2} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors" title="Share">
              <Share2 className="w-4 h-4" strokeWidth={2} />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors" title="Download">
              <Download className="w-4 h-4" strokeWidth={2} />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="artifact" className="h-full w-full p-8 m-0 overflow-auto bg-[#fdfdfd] text-gray-800">
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">Persona Deep Dive: Customer Executive (Call Center Agent)</h1>
            <p className="text-[13px] text-gray-600 mb-8 leading-relaxed">
              This document consolidates all UX Discovery, User, Task, and Journey parameters specifically for the Customer Executive
              persona, ensuring all design decisions for <strong>Surface A (Member Services)</strong> align with their specific operational realities.
            </p>
            
            <h2 className="text-xl font-medium mb-4 text-gray-900">4. Primary Journey: Friction Servicing</h2>
            <p className="text-[14px] text-gray-700 mb-6 leading-relaxed">
              <strong>The Scenario:</strong> John bought a $500 TV during a weekend multiplier campaign, but the points never appeared in his app. He is
              frustrated and calls customer service. The Customer Exec, Sarah, picks up the phone. Her goal is to calm John down, find his
              transaction, explain what went wrong, and credit the missing points as fast as possible without breaching data privacy
              protocols.
            </p>
            <p className="text-[13px] text-gray-500">Rendering Mermaid...</p>
          </TabsContent>
          
          <TabsContent value="editor" className="h-full w-full p-0 m-0 overflow-auto bg-[#fdfdfd]">
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
