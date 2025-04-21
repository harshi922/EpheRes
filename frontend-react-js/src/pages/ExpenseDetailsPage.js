import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

const ExpenseDetailPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadExpense = async () => {
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/${uuid}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (res.ok) {
        const data = await res.json();
        setExpense(data);
      } else if (res.status === 401) {
        navigate("/signin");
      } else {
        setError("Expense not found or error loading data.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpense();
  }, [uuid]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!expense) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{expense.description}</h1>
      <p className="text-gray-700">${expense.amount}</p>
      <p className="text-sm text-gray-500">{new Date(expense.created_at).toLocaleString()}</p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Participants</h2>
        <ul className="mt-2">
          {expense.participants.map((p, i) => (
            <li key={i}>
              {p.handle} — ${p.amount} — {p.paid ? "✅ Paid" : "❌ Unpaid"}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Comments</h2>
        <ul className="mt-2 space-y-2">
          {expense.comments.map((c) => (
            <li key={c.uuid}>
              <strong>{c.handle}</strong>: {c.message}
              <br />
              <small>{new Date(c.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseDetailPage;
