import React, { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, ChevronUp, Plus, ClipboardMinus } from "lucide-react";
import { ColorArr, StatusCard, StatusCardProps } from "../status-card";
import "./styles.scss";
import { Button } from "@/components/ui/button";

interface JobAccordionType extends StatusCardProps {
  data: any;
}

export const StatusAccordion = (props: JobAccordionType) => {
  const { data, status } = props;
  const [isOpen, setIsOpen] = useState(false);

  const { description, completed, total, name } = data;

  return (
    <Accordion.Item value={`item-${data.id}`} className="w-full">
      <Accordion.Header>
        <Accordion.Trigger className="w-full font-16 font-medium">
          <StatusCard className="card-wrapper" status={status}>
            <div className="icon-wrapper">{<ClipboardMinus size={36} />}</div>
            <div className="pl-6 flex flex-col justify-between items-start">
              <div
                className="font-30 font-bold"
                style={{ color: ColorArr[status] }}
              >
                {completed}
                {total ? `/${total}` : ""}
              </div>
              <p>{name}</p>
            </div>
            <div className="status-accordion-icon">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </StatusCard>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="accordion-content">
        <div className="max-w-md px-4 py-7 bg-white rounded-md shadow-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-14 font-medium">{description?.title}</h3>
            <div className="flex gap-1 items-center">
              <Plus className="h-3 w-3" />
              <Button variant="outline" className="text-sm accordion-button">
                {description?.createLinkText}
              </Button>
            </div>
          </div>

          <ul className="mb-4 pt-4 space-y-2 font-14">
            {description?.tasks?.map((task: string, i: number) => {
              return (
                <li
                  key={i}
                  className={`overflow-hidden overflow-ellipsis whitespace-nowrap ${
                    i === 3 ? "fourth-list" : ""
                  }`}
                >
                  {task}
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center items-center">
            <Button variant="outline" className="text-sm accordion-button">
              View All
            </Button>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default StatusAccordion;
