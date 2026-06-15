"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyCategories = [
  { _id: "1", name: "Bike", description: "Two-wheeled motorcycles" },
  { _id: "2", name: "Car", description: "Four-wheeled passenger vehicles" },
  { _id: "3", name: "Scooter", description: "Compact two-wheeled vehicles" },
  { _id: "4", name: "Jeep", description: "Large vehicles for groups or cargo" },
];

export default function CategoriesPage() {
  const [categories] = useState(dummyCategories);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Category Management</h1>
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Description</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-cyan-500 hover:text-cyan-600">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter category name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter description"
                className="border rounded-md px-3 py-2 text-sm outline-none focus:border-cyan-500 resize-none h-24"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 flex-1"
              onClick={() => setOpen(false)}
            >
              Create
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}