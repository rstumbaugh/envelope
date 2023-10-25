﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Envelope.Core.Models
{
    public class CategoryGroup 
    { 
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Category
    {
        public string Id { get; set; }
        public string GroupId { get; set; }
        public string Name { get; set; }
    }

}
