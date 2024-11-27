namespace aspAppAngular.Server.Models
{
	public static class Utilities
	{
		public static class RandomName
		{
            /// <summary>Creates random name.</summary>
            /// <param name="length">Lenght of name</param>
            /// <param name="dir">Directory location</param>
            /// <returns>Random name.</returns>
            public static string Create(int length, string dir)
            {
                var fileNames = new DirectoryInfo(dir).GetFiles().Select(x => x.Name).ToList();
                var name = "";
                var isDone = false;

                while (!isDone)
                {
                    var random = new Random();
                    name = "";

                    for (int i = 0; i < length; i++)
                    {
                        var j = random.Next(48, 122);

                        if (j >= 48 && j <= 57 || j >= 97 && j <= 122)
                        {
                            name += (char)j;
                        }
                        else
                        {
                            i--;
                        }
                    }

                    //Checks whether the name is inside some directory
                    if (!fileNames.Contains(name + ".jpg"))
                    {
                        isDone = true;
                    }
                }

                return name;
            }
        }

        public static class File
        {
            private static HttpClient client = null;

            static File()
            {
                client = new HttpClient();
            }

            public static async void Upload(string url, string path)
            {
                var file = await client.GetStreamAsync(url);

                using (var stream = System.IO.File.Create(path))
                {
                    await file.CopyToAsync(stream);
                }
            }

            public static async void Upload(IFormFile imageFile, string path)
            {
                using (var stream = System.IO.File.Create(path))
                {
                    await imageFile.CopyToAsync(stream);
                }
            }

            public static void Remove(string fullPath)
            {
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
        }
	}
}
