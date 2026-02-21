// src/hooks/useInvoices.ts
import { useState, useEffect } from "react";

export type Invoice = {
  id: string;
  title: string;
  company: string;
  amount: number;
  due_date: string;
  category: "telefone" | "internet" | "agua" | "energia" | "assinatura";
  status: "pending" | "paid" | "overdue";
};

export type Transaction = {
  id: string;
  type: "invoice_paid" | "transfer";
  title: string;
  amount: number;
  created_at: string;
  status: "success" | "pending" | "failed";
};

const FAKE_INVOICES: Invoice[] = [
  {
    id: "INV-001",
    title: "Conta de Telefone",
    company: "Sphere Telecomunições",
    amount: 89.9,
    due_date: "2026-02-15",
    category: "telefone",
    status: "pending",
  },
  {
    id: "INV-002",
    title: "Internet Banda Larga",
    company: "Nexon Telecom",
    amount: 199.9,
    due_date: "2026-02-12",
    category: "internet",
    status: "overdue",
  },
  {
    id: "INV-003",
    title: "Conta de Água",
    company: "Sphabesp NSV",
    amount: 156.42,
    due_date: "2026-02-20",
    category: "agua",
    status: "pending",
  },
  {
    id: "INV-004",
    title: "Energia Elétrica",
    company: "Nexel Distribuidora",
    amount: 312.65,
    due_date: "2026-02-18",
    category: "energia",
    status: "pending",
  },
  {
    id: "INV-005",
    title: "Assinatura Cloud Pro",
    company: "Vix Cloud",
    amount: 49.99,
    due_date: "2026-02-10",
    category: "assinatura",
    status: "overdue",
  },
];

export function useInvoices(initialBalance: number) {
  const [invoices, setInvoices] = useState<Invoice[]>(FAKE_INVOICES);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(initialBalance);

  const pendingInvoices = invoices.filter((inv) => inv.status === "pending" || inv.status === "overdue");
  const totalDue = pendingInvoices.reduce((acc, inv) => acc + inv.amount, 0);

  async function payInvoice(invoiceId: string) {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    // simula processamento
    await new Promise((resolve) => setTimeout(resolve, 800));

    // debita saldo
    const newBalance = balance - invoice.amount;
    setBalance(newBalance);

    // marca fatura como paga
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "paid" } : inv
      )
    );

    // adiciona ao histórico
    const transaction: Transaction = {
      id: "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: "invoice_paid",
      title: `Fatura paga: ${invoice.title}`,
      amount: invoice.amount,
      created_at: new Date().toISOString(),
      status: "success",
    };

    setTransactions((prev) => [transaction, ...prev]);
  }

  return {
    invoices,
    pendingInvoices,
    totalDue,
    transactions,
    balance,
    payInvoice,
  };
}
