using System.ComponentModel.DataAnnotations;

namespace API.Dto
{
    public class RegisterDto
    {
        private const string V = "Password must have 1 uppercase, 1 lowcase, 1 alphanumeric, 1 number and at least 6 charachters";

        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",
        ErrorMessage = V)]
        public string Password { get; set; }
        
    }
}