using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Payee { get; set; }
        public int CategoryId { get; set; }
        public string Note { get; set; }
        public double Amount { get; set; }
        public bool IsCleared { get; set; }
    }
}
