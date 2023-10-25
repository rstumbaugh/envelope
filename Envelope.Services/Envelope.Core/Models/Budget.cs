using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Models
{
    public class Budget
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Account[] Accounts { get; set; }
        public Category[] Categories { get; set; }
        public CategoryGroup[] CategoryGroups { get; set; }
        public Dictionary<string, MonthlyAssigned> MonthlyAssigned { get; set; }

    }

    public class MonthlyAssigned
    {
        public Dictionary<string, double> CategoryAssigned { get; set; }
    }
}
