using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PFLReact
{
    // initializes all the product details we will be utilizing in this project
    public class Product
    {
        public int id { get; set; }
        public int productID { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string imageURL { get; set; }
        public dynamic images { get; set; }
        public int? quantityDefault { get; set; }
        public int? quantityMinimum { get; set; }
        public int? quantityMaximum { get; set; }
        public int? quantityIncrement { get; set; }
        public bool hasTemplate { get; set; }
        public int? emailTemplateId { get; set; }
        public dynamic templateFields { get; set; }
        public dynamic deliveredPrices { get; set; }

    }
}
