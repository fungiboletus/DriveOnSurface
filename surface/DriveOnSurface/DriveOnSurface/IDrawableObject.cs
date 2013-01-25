using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Content;

namespace DriveOnSurface
{
    interface IDrawableObject
    {
        void Draw(SpriteBatch sb);

        void LoadContent(ContentManager theContentManager);
    }
}
