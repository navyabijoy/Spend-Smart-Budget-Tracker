"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase.js";

const budgetFormSchema = z.object({
  budget_name: z.string().min(1, { message: "Budget name is required" }),
  budget_amount: z.string().min(1, { message: "Budget amount is required" }),
});
const expenseFormSchema = z.object({
  expense_name: z.string().min(1, { message: "Expense name is required" }),
  expense_amount: z.string().min(1, { message: "Expense amount is required" }),
  expense_category: z.string().min(1, { message: "Budget category is required" }),
});

export default function AddBudget() {
  const { user } = useUser();
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [addBudgetDialogOpen, setAddBudgetDialogOpen] = useState(false);
  
  const budgetForm = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      budget_name: "",
      budget_amount: "",
    },
  })
  const expenseForm = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      expense_name: "",
      expense_amount: "",
      expense_category: "",
    },
  });
  
  if(!user) return null;
  console.log(user.id)
 // difference in setDoc and addDoc, setDoc auto generates its ID, but in addDoc you need to manually create an ID 
  async function onAddBudget(values: z.infer<typeof budgetFormSchema>) {
    try {
      if(!user) return;
      const userId = user.id;
      // users/{userId}/budgets/{auto-generated-id}/ then the setDoc data
      const budgetRef = doc(collection(db, "users", userId, "budgets"));
      await setDoc(budgetRef, {
        budget_name: values.budget_name,
        budget_amount: values.budget_amount,
        createdAt: new Date(),
      })
      console.log("Document written with ID: ", budgetRef.id);
      budgetForm.reset();
    } catch (error) {
      console.log("error in budget form submission: ", error);
    }
  }

  async function onAddExpense(values: z.infer<typeof expenseFormSchema>) {
   try {
    
    if(!user) return;
    const userId = user.id;
     // users/{userId}/expenses/{auto-generated-id}/ then the setDoc data
    const expenseRef = doc(collection(db, "users", userId, "expenses"));
    await setDoc(expenseRef, {
      expense_name: values.expense_name,
      expense_amount: values.expense_amount,
      expense_category: values.expense_category,
      createdAt: new Date(),
   })
    console.log("Document written with ID: ", expenseRef.id);
    expenseForm.reset();

   } catch (error) {
    console.log("error in expense form submission: ", error);
   }
  }


  return (
    <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer">Create</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => setAddBudgetDialogOpen(true)}
              className="cursor-pointer"
            >
              Add Budget
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setAddExpenseDialogOpen(true)}
              className="cursor-pointer"
            >
              Add Expense
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      <Dialog open={addBudgetDialogOpen} onOpenChange={setAddBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
          </DialogHeader>
          <Form {...budgetForm}>
            <form onSubmit={budgetForm.handleSubmit(onAddBudget)} className="space-y-4">
              <FormField
                control={budgetForm.control}
                name="budget_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-4">Budget Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Groceries" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={budgetForm.control}
                name="budget_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddBudgetDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Budget
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addExpenseDialogOpen}
        onOpenChange={setAddExpenseDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <Form {...expenseForm}>
            <form onSubmit={expenseForm.handleSubmit(onAddExpense)} className="space-y-4">
              <FormField
                control={expenseForm.control}
                name="expense_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-4">Expense Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Coffee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={expenseForm.control}
                name="expense_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="₹50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={expenseForm.control}
                name="expense_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddExpenseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Expense
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
