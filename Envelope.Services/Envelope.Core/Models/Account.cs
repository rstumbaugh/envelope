using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Models
{
    public enum AccountType
    {
        CashAccount, CreditCard, Loan, Tracking
    }

    public class Account
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Balance => UnclearedBalance + ClearedBalance;
        public double UnclearedBalance { get; set; }
        public double ClearedBalance { get; set; }
        public AccountType Type { get; set; }
        public bool IsOpen { get; set; } = true;
    }
}
