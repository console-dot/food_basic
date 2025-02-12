import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/LoginComponent";
import { Dashboard } from "./components/Dashboard";
import { useState } from "react";
import { ExpenseComponent } from "./components/ExpenseComponent";
import { ViewPurchase } from "./components/ViewPurchase";
import { ViewExpense } from "./components/ViewExpense";
import { SalesComponent } from "./components/SalesComponent";
import { PurchaseComponent } from "./components/PurchaseComponent";
function App() {
  const [purchaseItems, SetPurchaseItems] = useState([]);
  const [expenseItems, SetExpenseItems] = useState([]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view-purchase" element={<ViewPurchase />} />
        <Route path="/view-expense" element={<ViewExpense />} />
        <Route
          path="/today-purchase"
          element={
            <PurchaseComponent
              SetPurchaseItems={SetPurchaseItems}
              purchaseItems={purchaseItems}
            />
          }
        />
        <Route
          path="/today-expense"
          element={
            <ExpenseComponent
              SetExpenseItems={SetExpenseItems}
              expenseItems={expenseItems}
            />
          }
        />
        <Route path="/today-sales" element={<SalesComponent />} />
      </Routes>
    </>
  );
}

export default App;
