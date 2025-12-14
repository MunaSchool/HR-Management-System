"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

interface WorkflowRule {
  _id: string;
  ruleName: string;
  description: string;
  entityType: string;
  requiresApproval: boolean;
  approvalFlow: { role: string; order: number }[];
  isActive: boolean;
}

export default function WorkflowConfigPage() {
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([
    {
      _id: "1",
      ruleName: "Employee Profile Changes",
      description: "Approval required for employee profile updates",
      entityType: "employee_profile",
      requiresApproval: true,
      approvalFlow: [
        { role: "HR Admin", order: 1 },
        { role: "HR Manager", order: 2 },
      ],
      isActive: true,
    },
    {
      _id: "2",
      ruleName: "Organization Structure Changes",
      description: "Approval required for department/position changes",
      entityType: "organization_structure",
      requiresApproval: true,
      approvalFlow: [
        { role: "HR Manager", order: 1 },
        { role: "System Admin", order: 2 },
      ],
      isActive: true,
    },
    {
      _id: "3",
      ruleName: "Payroll Configuration Changes",
      description: "Approval required for payroll settings",
      entityType: "payroll_config",
      requiresApproval: true,
      approvalFlow: [
        { role: "Payroll Manager", order: 1 },
        { role: "System Admin", order: 2 },
      ],
      isActive: true,
    },
  ]);

  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleActive = (ruleId: string) => {
    setWorkflowRules((prev) =>
      prev.map((rule) =>
        rule._id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleEditRule = (rule: WorkflowRule) => {
    setEditingRule(JSON.parse(JSON.stringify(rule)));
    setShowEditModal(true);
  };

  const handleSaveRule = () => {
    if (!editingRule) return;

    setWorkflowRules((prev) =>
      prev.map((rule) =>
        rule._id === editingRule._id ? editingRule : rule
      )
    );
    setShowEditModal(false);
    setEditingRule(null);
    alert("Workflow rule updated successfully");
  };

  const handleAddApprovalStep = () => {
    if (!editingRule) return;

    const newStep = {
      role: "HR Admin",
      order: editingRule.approvalFlow.length + 1,
    };

    setEditingRule({
      ...editingRule,
      approvalFlow: [...editingRule.approvalFlow, newStep],
    });
  };

  const handleRemoveApprovalStep = (index: number) => {
    if (!editingRule) return;

    const newFlow = editingRule.approvalFlow.filter((_, i) => i !== index);
    // Reorder remaining steps
    const reorderedFlow = newFlow.map((step, i) => ({ ...step, order: i + 1 }));

    setEditingRule({
      ...editingRule,
      approvalFlow: reorderedFlow,
    });
  };

  const handleUpdateApprovalRole = (index: number, role: string) => {
    if (!editingRule) return;

    const newFlow = [...editingRule.approvalFlow];
    newFlow[index] = { ...newFlow[index], role };

    setEditingRule({
      ...editingRule,
      approvalFlow: newFlow,
    });
  };

  const availableRoles = [
    "HR Admin",
    "HR Manager",
    "System Admin",
    "Payroll Manager",
    "Payroll Specialist",
    "Department Head",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workflow Configuration</h1>
          <p className="text-neutral-400">
            Configure approval workflows for system changes (BR 36)
          </p>
        </div>

        {/* Workflow Rules List */}
        <div className="space-y-4">
          {workflowRules.map((rule) => (
            <div
              key={rule._id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{rule.ruleName}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rule.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm mt-1">
                    {rule.description}
                  </p>
                  <p className="text-neutral-500 text-xs mt-1">
                    Entity Type: <span className="text-white">{rule.entityType}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(rule._id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      rule.isActive
                        ? "bg-neutral-800 text-white hover:bg-neutral-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {rule.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200"
                  >
                    Edit Workflow
                  </button>
                </div>
              </div>

              {/* Approval Flow Display */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-neutral-400 mb-2">
                  Approval Flow:
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {rule.approvalFlow
                    .sort((a, b) => a.order - b.order)
                    .map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-sm">
                          <span className="text-neutral-400">{step.order}.</span>{" "}
                          <span className="font-medium">{step.role}</span>
                        </div>
                        {index < rule.approvalFlow.length - 1 && (
                          <span className="text-neutral-600">→</span>
                        )}
                      </div>
                    ))}
                  {rule.approvalFlow.length === 0 && (
                    <span className="text-neutral-500 text-sm italic">
                      No approval required
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingRule && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Edit Workflow Rule</h2>

                {/* Rule Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={editingRule.ruleName}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, ruleName: e.target.value })
                    }
                    className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingRule.description}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 text-white"
                  />
                </div>

                {/* Requires Approval */}
                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingRule.requiresApproval}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          requiresApproval: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Requires Approval</span>
                  </label>
                </div>

                {/* Approval Flow */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium">
                      Approval Flow
                    </label>
                    <button
                      onClick={handleAddApprovalStep}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingRule.approvalFlow.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-black border border-neutral-700 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-neutral-400 font-medium">
                            {step.order}.
                          </span>
                          <select
                            value={step.role}
                            onChange={(e) =>
                              handleUpdateApprovalRole(index, e.target.value)
                            }
                            className="flex-1 rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-white"
                          >
                            {availableRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemoveApprovalStep(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveRule}
                    className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-neutral-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingRule(null);
                    }}
                    className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg font-medium hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
