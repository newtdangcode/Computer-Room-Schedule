import React from "react";
import styles from './styles.module.css';
export default function Footer() {
  return (
    <footer className={`${styles.footer} bg-red-800 text-white py-4 text-center`}>
      <p>&copy; 2024 Group 13 of D21AT. All rights reserved.</p>
    </footer>
  );
};


