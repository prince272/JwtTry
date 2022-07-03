namespace BookStore.Entities
{
    public class Book
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public BookCategory Category { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }
    }

    public enum BookCategory
    {
        Action,
        Classics,
        Comic,
        Mystery,
        Fantasy,
        Horror
    }
}
