"use client";

import { useEffect, useState } from "react";

import { ExplanationMeta, ExplanationType, useObservable } from "@/components/explanation/observable";
import { cn } from "@/lib/utils";
import Events from "@/llm/components/events/events.mdx";
import Forecasts from "@/llm/components/forecasts/documents.mdx";
import ConditionalPurchase from "@/llm/components/stocks/conditional-purchase.mdx";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function Explanation({
  expand = false,
  allowToggleExpand = true,
  explanationType = ExplanationType.StocksUpcomingEvents,
  onChange,
}: {
  expand?: boolean;
  allowToggleExpand?: boolean;
  explanationType?: ExplanationType;
  onChange?: (value: ExplanationType) => void;
}) {
  const [expanded, setExpanded] = useState<boolean>(expand);
  const [lastExplanation, setLastExplanation] = useState<ExplanationMeta>({
    type: explanationType,
  });
  const { explanation, setExplanation } = useObservable();

  useEffect(() => {
    if (explanation) {
      setExpanded(!!explanation.expand);
      setLastExplanation(explanation);
    }
  }, [explanation]);

  function toggleExpanded() {
    setExpanded(!expanded);
    setExplanation(null);
  }

  function handleOnChange(value: ExplanationType) {
    if (typeof onChange === "function") {
      onChange(value);
    }

    setLastExplanation({ type: value });
  }

  return (
    <div
      className={cn(
        allowToggleExpand && "hidden",
        "sm:flex flex-col flex-no-wrap h-full p-6",
        !allowToggleExpand && "p-0",
        expanded ? "max-w-2xl" : "w-[116px] max-w-[116px] h-[116px] absolute right-0"
      )}
    >
      <div
        className={cn(
          "flex-1 h-full rounded-3xl",
          expanded ? "p-8 pt-5 sm:p-8" : "p-4 rounded-2xl",
          allowToggleExpand ? "bg-[#FAFAFD]" : "bg-white rounded-none",
          "border-t sm:border-t-0"
        )}
      >
        <div
          className={cn(
            "w-full flex items-center justify-between gap-3 pb-5 px-0 border-[#E2E8F0] rounded-t-3xl",
            allowToggleExpand ? "bg-[#FAFAFD]" : "bg-white",
            expanded ? "border-b" : "border-none pb-0"
          )}
        >
          {allowToggleExpand && (
            <div className="flex items-center gap-3">
              <button onClick={toggleExpanded} className="border border-[#E2E8F0] rounded-lg p-2">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("transition-all duration-150", expanded ? "" : "rotate-180")}
                >
                  <path
                    d="M26 34L36 24L26 14M12 34L22 24L12 14"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  />
                </svg>
              </button>
            </div>
          )}

          {!allowToggleExpand && <span className="hidden sm:block text-sm sm:text-base">Docs</span>}

          {expanded && (
            <div className="flex items-center gap-3 w-full sm:w-fit">
              <div className="text-sm text-gray-600 min-w-fit">Use case</div>
              <Select value={lastExplanation?.type} onValueChange={handleOnChange}>
                <SelectTrigger className="w-full sm:w-[230px] py-0 text-gray-500 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-gray-500 text-sm" value={ExplanationType.StocksUpcomingEvents}>
                      Call APIs on users&apos; behalf
                    </SelectItem>
                    <SelectItem className="text-gray-500 text-sm" value={ExplanationType.Documents}>
                      Authorization for RAG
                    </SelectItem>
                    <SelectItem className="text-gray-500 text-sm" value={ExplanationType.StockConditionalPurchase}>
                      Async User Confirmartion
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {expanded && (
          <div
            className={cn(
              "transition-all duration-300 h-full p-5 -mx-8 px-8 flex-1",
              allowToggleExpand ? "overflow-y-auto" : "sm:overflow-y-auto"
            )}
            style={{ height: "calc(100% - 56px)" }}
          >
            {lastExplanation?.type === ExplanationType.StocksUpcomingEvents && <Events />}
            {lastExplanation?.type === ExplanationType.StockConditionalPurchase && <ConditionalPurchase />}
            {lastExplanation?.type === ExplanationType.Documents && <Forecasts />}
          </div>
        )}
      </div>
    </div>
  );
}
