using System.ComponentModel.DataAnnotations;

namespace A2_jji134.Dtos 
{
    public class PurchaseOutputDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string SignID { get; set; }
    }
}