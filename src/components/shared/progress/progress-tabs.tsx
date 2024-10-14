import React, { useState } from "react";
import "./progress-tab.scss";
import * as Popover from "@radix-ui/react-popover";
import {
  QuestionCategory,
  QuestionStateType,
} from "@/pages/buildings/components/types";

interface ProgressTabsProps {
  SegmentsData: QuestionCategory[];
  activeTabId?: string;
  moveToSpecificTab: (id: string) => void;
}

export default function ProgressTabs(props: ProgressTabsProps) {
  const { SegmentsData, activeTabId, moveToSpecificTab } = props;

  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  const returnCurrentQuestionInfo = (id: string) => {
    return SegmentsData?.find((question) => question._id === id);
  };

  return (
    <div className="progress-container">
      <div className="progress-background bg-secondary">
        {SegmentsData.map((segment, index) => {
          const filled =
            (segment.fieldFilledCount / segment.totalFieldCount) * 100;
          const isActive = segment._id === activeTabId;
          const circleLeft = filled <= 13 ? 2 : filled - 13;

          return (
            <Popover.Root
              key={index}
              open={openPopoverIndex === index}
              onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}
            >
              <Popover.Trigger asChild>
                <div
                  className={`segment bg-[#CBD5E1] ${
                    isActive ? "active-segment" : ""
                  }`}
                  role="presentation"
                  onMouseEnter={() => setOpenPopoverIndex(index)}
                  onMouseLeave={() => setOpenPopoverIndex(null)}
                  onClick={() => moveToSpecificTab(segment._id)}
                >
                  <div
                    className={filled > 0 ? "filled-segment" : ""}
                    style={{ width: `${filled}%` }}
                  ></div>
                  {isActive && (
                    <div
                      className="white-circle"
                      style={{ left: `${circleLeft}%` }}
                    ></div>
                  )}
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  className="popover-content mw-250 bg-primary"
                  side="top"
                  align="center"
                >
                  <div className="text-muted text-center">
                    {segment.title}
                    <>
                      &nbsp; ({segment.fieldFilledCount}/
                      {segment.totalFieldCount})
                    </>
                  </div>
                  <Popover.Arrow />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          );
        })}
      </div>

      <div className="segment-labels">
        {SegmentsData.map((segment, index) => {
          const isActive = segment._id === activeTabId;
          return (
            <span
              key={index}
              className={`segment-label ${isActive ? "active-label" : ""}`}
              style={{ width: `${100 / SegmentsData.length}%` }}
              role="presentation"
            >
              {segment.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
