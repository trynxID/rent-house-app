import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbarpenyewa from "../components/navbarpenyewa";

const formatTransactionDate = (dateString) => {
  // Parsing the date string to get individual components
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const hours = dateString.substring(8, 10);
  const minutes = dateString.substring(10, 12);
  const seconds = dateString.substring(12, 14);

  // Create a new Date object
  const date = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  );

  // Format the date to a more readable format
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",    
  });
};

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asumsi token disimpan di localStorage
          },
        });
        console.log(response.data);
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <Navbarpenyewa />
      <div className="container">
        <h1>History transaksi</h1>
        {transactions.length === 0 ? (
          <p>Tidak ada transaksi ditemukan</p>
        ) : (
          <div className="property-list">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="property-item">
                {transaction.booking.property.images &&
                  transaction.booking.property.images.length > 0 && (
                    <img
                      src={transaction.booking.property.images[0]}
                      alt={transaction.booking.property.title}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                <h3>Kode bayar : {transaction.kode_bayar}</h3>
                <p>Metode pembayaran : {transaction.payment_method}</p>
                <p>Status : {transaction.status}</p>
                <p>
                  Waktu transaksi : {formatTransactionDate(transaction.transaction_date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaksi;
